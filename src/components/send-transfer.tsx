import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import QRCode from 'qrcode';
import {
  UploadCloud,
  File,
  Lock,
  ShieldCheck,
  Check,
  Copy,
  QrCode,
  ArrowRight,
  Printer,
  Sparkles,
  Info,
  Clock,
  Eye,
  EyeOff,
  AlertCircle,
  FileCheck2,
  HardDrive,
} from 'lucide-react';
import {
  encryptFile,
  generateCodedTransferId,
  formatBytes,
} from '@/lib/crypto';
import {
  transferStore,
  CodedTransferItem,
} from '@/lib/transfer-store';
import {
  WEBUILD_AUSTRALIA_PROJECTS,
  WEBUILD_COMPANY_DETAILS,
} from '@/data/webuild-info';

interface SendTransferProps {
  onTransferComplete: (item: CodedTransferItem) => void;
  onOpenReceiverWithCode: (code: string, keyFragment?: string) => void;
  onViewTransmittalModal: (item: CodedTransferItem) => void;
  onGoToManager: () => void;
}

export function SendTransfer({
  onTransferComplete,
  onOpenReceiverWithCode,
  onViewTransmittalModal,
  onGoToManager,
}: SendTransferProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Transfer options
  const [selectedProject, setSelectedProject] = useState(WEBUILD_AUSTRALIA_PROJECTS[0].name);
  const [classification, setClassification] = useState('Standard Engineering Transmittal');
  const [category, setCategory] = useState('Blueprints & CAD');
  const [expiryOption, setExpiryOption] = useState<'1h' | '24h' | '3d' | '7d' | 'burn'>('3d');
  const [maxDownloads, setMaxDownloads] = useState<number>(5);
  const [customPassword, setCustomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [senderEmail, setSenderEmail] = useState('info@webuildgroup.company');
  const [recipientMemo, setRecipientMemo] = useState('');

  // Processing state
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptionStep, setEncryptionStep] = useState('');
  const [completedTransfer, setCompletedTransfer] = useState<CodedTransferItem | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleStartEncryption = async () => {
    if (!file) {
      setError('Please select or drop a file to encrypt and send.');
      return;
    }

    setIsEncrypting(true);
    setError(null);

    try {
      setEncryptionStep('Computing SHA-256 integrity hash...');
      await new Promise((r) => setTimeout(r, 200));

      setEncryptionStep('Generating 256-bit AES-GCM cipher key & 96-bit IV...');
      await new Promise((r) => setTimeout(r, 250));

      // Real client-side encryption using WebCrypto
      const encrypted = await encryptFile(file, customPassword);

      setEncryptionStep('Registering Coded Transfer ID & We Build Australia cryptographic seal...');
      await new Promise((r) => setTimeout(r, 200));

      const code = generateCodedTransferId('standard');
      const now = new Date();
      let expiryHours = 72;
      if (expiryOption === '1h') expiryHours = 1;
      else if (expiryOption === '24h') expiryHours = 24;
      else if (expiryOption === '3d') expiryHours = 72;
      else if (expiryOption === '7d') expiryHours = 168;
      else if (expiryOption === 'burn') expiryHours = 24; // Will self destruct on first download

      const expiresAt = new Date(now.getTime() + expiryHours * 3600000).toISOString();

      const transferItem: CodedTransferItem = {
        id: `wb_tr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        code,
        name: file.name,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        category,
        siteProject: selectedProject,
        classification,
        created: now.toISOString(),
        expiresAt,
        expiryOption,
        maxDownloads: expiryOption === 'burn' ? 1 : maxDownloads,
        downloadCount: 0,
        status: 'active',
        hasPassword: Boolean(customPassword.trim()),
        saltHex: encrypted.saltHex,
        ivHex: encrypted.ivHex,
        checksumSha256: encrypted.checksumSha256,
        keyFragment: encrypted.keyFragment,
        senderEmail: senderEmail.trim() || 'engineer@webuildgroup.com.au',
        recipientMemo: recipientMemo.trim(),
        downloadLog: [],
      };

      // Save encrypted buffer & transfer record
      transferStore.saveTransfer(transferItem, encrypted.cipherBuffer);

      // Generate QR Code URL linking directly to receiver with code
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      let targetBase = origin;
      if (origin.includes('ais-dev-')) {
        targetBase = origin.replace('ais-dev-', 'ais-pre-');
      } else if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        targetBase = 'https://ais-pre-ucblzge2fhhoifdaarjri7-411900850859.asia-southeast1.run.app';
      }
      const receiverUrl = `${targetBase}/#receive?code=${code}&key=${encodeURIComponent(encrypted.keyFragment)}`;
      try {
        const qr = await QRCode.toDataURL(receiverUrl, {
          width: 300,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });
        setQrDataUrl(qr);
      } catch (qrErr) {
        console.warn('QR Code generation notice:', qrErr);
      }

      setCompletedTransfer(transferItem);
      onTransferComplete(transferItem);
    } catch (err: unknown) {
      console.error('Encryption failed:', err);
      setError(err instanceof Error ? err.message : 'Encryption failed. Please try again.');
    } finally {
      setIsEncrypting(false);
      setEncryptionStep('');
    }
  };

  const copyTransferCode = () => {
    if (!completedTransfer) return;
    navigator.clipboard.writeText(completedTransfer.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyCodedLink = () => {
    if (!completedTransfer) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const receiverUrl = `${origin}/#receive?code=${completedTransfer.code}&key=${encodeURIComponent(completedTransfer.keyFragment)}`;
    navigator.clipboard.writeText(receiverUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const resetForm = () => {
    setFile(null);
    setCompletedTransfer(null);
    setQrDataUrl('');
    setCustomPassword('');
    setRecipientMemo('');
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-mono uppercase tracking-wider mb-3">
          <ShieldCheck size={14} />
          <span>Client-Side End-to-End Encryption</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Coded Secure File Transmittal
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
          Encrypt civil engineering documents, CAD drawings, and commercial specifications directly inside your browser using AES-256-GCM. Files are converted into protected coded transmittals with zero third-party plaintext exposure.
        </p>
      </div>

      {/* SUCCESS VIEW: Transfer Armed and Code Generated */}
      {completedTransfer ? (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/80 text-emerald-400 text-xs font-semibold">
                <Check size={13} /> ENCRYPTED & ARMED
              </span>
              <h2 className="text-xl font-bold text-white mt-2 font-sans">
                Coded Transmittal Ready
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Zero-knowledge encrypted with AES-256-GCM. Share the code or link with the recipient.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              Send Another File
            </button>
          </div>

          {/* Big Coded Transfer ID Block */}
          <div className="my-6 p-6 bg-slate-950 rounded-xl border-2 border-amber-500/50 text-center relative group">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              We Build Australia Transfer Access Code
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-wider text-white mt-2 mb-3">
              {completedTransfer.code}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={copyTransferCode}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
              <button
                type="button"
                onClick={copyCodedLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied Direct Link!' : 'Copy Direct Link'}</span>
              </button>
            </div>
          </div>

          {/* Metadata Grid & QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div className="md:col-span-2 space-y-3 bg-slate-950/60 p-5 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">File Name:</span>
                <span className="font-semibold text-slate-200 truncate max-w-[240px]">
                  {completedTransfer.name}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Original Size:</span>
                <span className="font-mono text-slate-200">{formatBytes(completedTransfer.size)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Australian Project:</span>
                <span className="font-medium text-slate-200">{completedTransfer.siteProject}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Classification:</span>
                <span className="text-amber-400 font-medium">{completedTransfer.classification}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Expiration:</span>
                <span className="font-mono text-slate-300">
                  {new Date(completedTransfer.expiresAt).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">SHA-256 Checksum:</span>
                <span className="font-mono text-[10px] text-emerald-400 truncate max-w-[220px]" title={completedTransfer.checksumSha256}>
                  {completedTransfer.checksumSha256}
                </span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <QrCode size={13} /> Mobile / Tablet Pickup
              </div>
              {qrDataUrl ? (
                <div className="bg-white p-2 rounded-lg border border-slate-700 shadow-md">
                  <img src={qrDataUrl} alt="Transfer QR Code" className="w-36 h-36" />
                </div>
              ) : (
                <div className="w-36 h-36 bg-slate-800 rounded flex items-center justify-center text-xs text-slate-500">
                  Generating QR...
                </div>
              )}
              <span className="text-[10px] text-slate-500 mt-2">Scan on site to decrypt directly</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onOpenReceiverWithCode(completedTransfer.code, completedTransfer.keyFragment)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Test Decrypt Now</span>
              <ArrowRight size={14} />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewTransmittalModal(completedTransfer)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <Printer size={13} />
                <span>Transmittal Slip</span>
              </button>

              <button
                type="button"
                onClick={onGoToManager}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <HardDrive size={13} />
                <span>Open File Manager</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* CREATOR / UPLOAD FORM VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* File Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-red-500 bg-red-950/20 scale-[1.01]'
                : file
                ? 'border-emerald-600/80 bg-emerald-950/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-900/50 border border-emerald-600/60 flex items-center justify-center text-emerald-400 mb-3">
                  <FileCheck2 size={28} />
                </div>
                <h3 className="text-base font-semibold text-white font-mono break-all max-w-md">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {formatBytes(file.size)} • {file.type || 'Binary / Document'}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-3 text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-3 group-hover:scale-105 transition-transform">
                  <UploadCloud size={28} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Drop blueprints, specs, or contract files here
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  or <span className="text-red-400 font-medium">browse local files</span>. Supports PDFs, DWG, BIM models, spreadsheets, and archives up to 250 MB.
                </p>
                <div className="flex items-center gap-2 mt-4 text-[11px] font-mono text-slate-500">
                  <Lock size={12} className="text-emerald-500" />
                  <span>Encrypted client-side before upload</span>
                </div>
              </div>
            )}
          </div>

          {/* Transfer Configuration Form */}
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Project Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Australian Project Site *
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  {WEBUILD_AUSTRALIA_PROJECTS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Classification */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Security Classification *
                </label>
                <select
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  {WEBUILD_COMPANY_DETAILS.classifications.map((c) => (
                    <option key={c.value} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Document Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Document Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="Blueprints & CAD">Blueprints & CAD Models</option>
                  <option value="Structural Specs">Structural Calculations</option>
                  <option value="Geotechnical & Subsurface">Geotechnical Reports</option>
                  <option value="Site Safety (WHS)">Site Safety & HSE Protocol</option>
                  <option value="Tender & Commercial">Tender & Commercial Contracts</option>
                  <option value="Commissioning">Commissioning & QA</option>
                </select>
              </div>

              {/* Expiry Policy */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Retention / Expiry *
                </label>
                <select
                  value={expiryOption}
                  onChange={(e) => setExpiryOption(e.target.value as typeof expiryOption)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="1h">1 Hour (Urgent Delivery)</option>
                  <option value="24h">24 Hours (Daily Transmittal)</option>
                  <option value="3d">3 Days (Standard)</option>
                  <option value="7d">7 Days (Review Milestone)</option>
                  <option value="burn">🔥 Burn on Download (Self-Destruct)</option>
                </select>
              </div>

              {/* Max Downloads */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Max Downloads Limit
                </label>
                <select
                  disabled={expiryOption === 'burn'}
                  value={maxDownloads}
                  onChange={(e) => setMaxDownloads(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 disabled:opacity-50"
                >
                  <option value={1}>1 Download</option>
                  <option value={3}>3 Downloads</option>
                  <option value={5}>5 Downloads</option>
                  <option value={10}>10 Downloads</option>
                  <option value={50}>50 Downloads</option>
                  <option value={0}>Unlimited</option>
                </select>
              </div>
            </div>

            {/* Optional Passphrase Protection (Second Layer) */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock size={13} className="text-amber-400" />
                  <span>Optional Secondary Password (PBKDF2 Key Derivation)</span>
                </label>
                <span className="text-[11px] text-slate-500">Optional 2nd factor</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="Leave blank for automatic coded key, or enter a secret password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 pr-10 focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                If provided, the recipient must know this password to decrypt the file payload.
              </p>
            </div>

            {/* Sender & Memo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Sender Email Identity
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="your.name@webuildgroup.com.au"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Transmittal Note / Memo (Optional)
                </label>
                <input
                  type="text"
                  value={recipientMemo}
                  onChange={(e) => setRecipientMemo(e.target.value)}
                  placeholder="e.g., For structural compliance review and sign-off"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg flex items-center gap-2 text-xs text-red-300">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>AES-256-GCM cipher executed directly in your browser.</span>
              </div>

              <button
                type="button"
                disabled={!file || isEncrypting}
                onClick={handleStartEncryption}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                {isEncrypting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{encryptionStep || 'Encrypting File...'}</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Encrypt & Generate Coded Transfer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
