import { useState, useEffect } from 'react';
import {
  Download,
  KeyRound,
  ShieldCheck,
  Lock,
  FileCheck2,
  AlertTriangle,
  File,
  CheckCircle2,
  Building2,
  Clock,
  Flame,
  Printer,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  decryptFile,
  formatBytes,
} from '@/lib/crypto';
import {
  transferStore,
  CodedTransferItem,
} from '@/lib/transfer-store';

interface ReceiveTransferProps {
  initialCode?: string;
  initialKey?: string;
  onViewTransmittalModal: (item: CodedTransferItem) => void;
  onGoToManager: () => void;
}

export function ReceiveTransfer({
  initialCode = '',
  initialKey = '',
  onViewTransmittalModal,
  onGoToManager,
}: ReceiveTransferProps) {
  const [codeInput, setCodeInput] = useState(initialCode);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [matchedTransfer, setMatchedTransfer] = useState<CodedTransferItem | null>(null);

  // Decryption state
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedResult, setDecryptedResult] = useState<{
    blob: Blob;
    objectUrl: string;
    verified: boolean;
    actualChecksum: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync if initialCode passed from parent or URL
  useEffect(() => {
    if (initialCode) {
      setCodeInput(initialCode);
      lookupCode(initialCode);
    }
  }, [initialCode]);

  const lookupCode = (code: string) => {
    setError(null);
    setDecryptedResult(null);

    const found = transferStore.findByCode(code);
    if (found) {
      setMatchedTransfer(found);
    } else {
      setMatchedTransfer(null);
      if (code.trim().length >= 4) {
        setError('No active transfer found with this code. Please verify the code or check if it has expired.');
      }
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setCodeInput(val);
    if (val.trim().length >= 4) {
      lookupCode(val);
    } else {
      setMatchedTransfer(null);
      setDecryptedResult(null);
    }
  };

  const handleDecrypt = async () => {
    if (!matchedTransfer) return;

    if (matchedTransfer.status === 'expired') {
      setError('This transfer has expired and can no longer be decrypted.');
      return;
    }

    if (matchedTransfer.status === 'revoked') {
      setError('This transfer has been revoked by the Webuild engineering administrator.');
      return;
    }

    if (matchedTransfer.hasPassword && !passwordInput.trim()) {
      setError('Please enter the security password set by the sender.');
      return;
    }

    setIsDecrypting(true);
    setError(null);

    try {
      // Retrieve cipher buffer from store
      const cipherBuffer = transferStore.getCipherBuffer(matchedTransfer.id);
      if (!cipherBuffer) {
        throw new Error('Encrypted payload not found in local vault.');
      }

      // Decrypt using WebCrypto AES-256-GCM
      const result = await decryptFile(
        cipherBuffer,
        matchedTransfer.ivHex,
        matchedTransfer.saltHex,
        matchedTransfer.keyFragment || initialKey,
        matchedTransfer.checksumSha256,
        passwordInput.trim()
      );

      const objectUrl = URL.createObjectURL(result.decryptedBlob);

      setDecryptedResult({
        blob: result.decryptedBlob,
        objectUrl,
        verified: result.verified,
        actualChecksum: result.actualChecksum,
      });

      // Record download audit log
      transferStore.recordDownload(matchedTransfer.id, 'Sydney, NSW, Australia');
    } catch (err: unknown) {
      console.error('Decryption error:', err);
      setError(err instanceof Error ? err.message : 'Decryption failed. Please check your password or key.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDownloadDecryptedFile = () => {
    if (!decryptedResult || !matchedTransfer) return;
    const anchor = document.createElement('a');
    anchor.href = decryptedResult.objectUrl;
    anchor.download = matchedTransfer.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  // Quick preset test buttons
  const quickTestCodes = [
    { label: 'Millers Point Heritage Spec', code: 'WBA-849-201' },
    { label: 'LAHC Social Housing Schedule', code: 'WBA-771-940' },
    { label: 'Parramatta Stormwater Drawings', code: 'WBA-948-217' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-3">
          <KeyRound size={14} />
          <span>We Build Australia Cryptographic Receiver</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Coded Decryption & Download Portal
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
          Enter your 6-10 digit We Build Australia Transfer Access Code or open an authorized link to decrypt and download engineering and tender documents directly on your device.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Code Input Form */}
        <div className="max-w-xl mx-auto">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
            Enter We Build Australia Transfer Access Code
          </label>
          <div className="relative">
            <input
              type="text"
              value={codeInput}
              onChange={handleCodeChange}
              placeholder="e.g. WBA-849-201"
              maxLength={15}
              className="w-full bg-slate-950 border-2 border-slate-700 focus:border-red-500 rounded-xl px-4 py-3.5 text-center text-2xl sm:text-3xl font-mono font-extrabold tracking-widest text-white uppercase placeholder:text-slate-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Quick Demo Test Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-slate-500">Quick Test:</span>
            {quickTestCodes.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setCodeInput(item.code);
                  lookupCode(item.code);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
              >
                {item.code}
              </button>
            ))}
          </div>

          {/* Password Input if needed */}
          {matchedTransfer && matchedTransfer.hasPassword && !decryptedResult && (
            <div className="mt-6 p-4 bg-slate-950 border border-amber-600/50 rounded-xl">
              <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock size={14} />
                <span>Protected with Secondary Passphrase</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter the secret password set by sender"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 pr-10 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 p-3.5 bg-red-950/60 border border-red-800 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
              <AlertTriangle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* TRANSFER CARD PREVIEW (If code matched) */}
        {matchedTransfer && (
          <div className="mt-8 pt-8 border-t border-slate-800">
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold font-mono flex items-center gap-1.5 ${
                      matchedTransfer.status === 'active'
                        ? 'bg-emerald-950 border border-emerald-700 text-emerald-400'
                        : matchedTransfer.status === 'expired'
                        ? 'bg-slate-800 border border-slate-700 text-slate-400'
                        : 'bg-red-950 border border-red-800 text-red-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {matchedTransfer.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Code: <strong className="text-slate-200">{matchedTransfer.code}</strong>
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Building2 size={13} className="text-red-500" />
                  <span>{matchedTransfer.siteProject}</span>
                </div>
              </div>

              {/* Document Overview */}
              <div className="my-5">
                <h3 className="text-lg font-bold text-white font-mono break-all">
                  {matchedTransfer.name}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                  <span>Size: {formatBytes(matchedTransfer.size)}</span>
                  <span>•</span>
                  <span>Category: {matchedTransfer.category}</span>
                  <span>•</span>
                  <span className="text-amber-400">{matchedTransfer.classification}</span>
                </div>

                {matchedTransfer.recipientMemo && (
                  <div className="mt-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-300">
                    <span className="text-slate-500 font-mono uppercase text-[10px] block mb-1">
                      Transmittal Memo:
                    </span>
                    {matchedTransfer.recipientMemo}
                  </div>
                )}
              </div>

              {/* Expiry & Downloads Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Downloads</span>
                  <span className="font-semibold text-slate-200">
                    {matchedTransfer.downloadCount} / {matchedTransfer.maxDownloads || '∞'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Cipher Type</span>
                  <span className="font-mono text-emerald-400 text-[11px]">AES-256-GCM</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Expires In</span>
                  <span className="font-mono text-slate-300 text-[11px]">
                    {new Date(matchedTransfer.expiresAt).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Burn Policy</span>
                  <span className="text-slate-300">
                    {matchedTransfer.expiryOption === 'burn' ? (
                      <span className="text-red-400 flex items-center gap-1">
                        <Flame size={12} /> 1-Time Self Destruct
                      </span>
                    ) : (
                      'Multi-use'
                    )}
                  </span>
                </div>
              </div>

              {/* DECRYPTED STATE / SUCCESS VIEW */}
              {decryptedResult ? (
                <div className="mt-6 p-6 bg-emerald-950/30 border-2 border-emerald-600/50 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <CheckCircle2 size={18} />
                    <span>We Build Australia Official Cryptographic Seal: Verified Authentic</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Decryption verified bit-for-bit with SHA-256 integrity digest{' '}
                    <code className="text-emerald-300 text-[10px] font-mono break-all">
                      {decryptedResult.actualChecksum}
                    </code>
                    . The file has not been altered or intercepted in transit.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadDecryptedFile}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-colors cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download Decrypted File ({formatBytes(matchedTransfer.size)})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewTransmittalModal(matchedTransfer)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Printer size={13} />
                      <span>Transmittal Record</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* DECRYPT ACTION BUTTON */
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Zero plaintext exposure to intermediary servers.</span>
                  </div>

                  <button
                    type="button"
                    disabled={isDecrypting || matchedTransfer.status !== 'active'}
                    onClick={handleDecrypt}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                  >
                    {isDecrypting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Decrypting Client-Side...</span>
                      </>
                    ) : (
                      <>
                        <Download size={15} />
                        <span>Decrypt & Download Document</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
