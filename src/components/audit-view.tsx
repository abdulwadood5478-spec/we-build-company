import { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  Search,
  Printer,
  Download,
  Building2,
  Calendar,
  Lock,
  ExternalLink,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { transferStore, CodedTransferItem } from '@/lib/transfer-store';
import { formatBytes } from '@/lib/crypto';
import { WEBUILD_COMPANY_DETAILS } from '@/data/webuild-info';

interface AuditViewProps {
  onOpenReceiverWithCode: (code: string, keyFragment?: string) => void;
  onViewTransmittalModal: (item: CodedTransferItem) => void;
}

export function AuditView({
  onOpenReceiverWithCode,
  onViewTransmittalModal,
}: AuditViewProps) {
  const [transfers] = useState<CodedTransferItem[]>(() => transferStore.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CodedTransferItem | null>(transfers[0] || null);

  const filtered = transfers.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.siteProject.toLowerCase().includes(q) ||
      t.checksumSha256.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-mono uppercase tracking-wider mb-2">
          <FileCheck2 size={13} />
          <span>Official Transmittal Register</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Engineering Transmittals & Cryptographic Audit
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Complete chain-of-custody audit trail for every encrypted document issued across Webuild Group Australia infrastructure projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transmittal List & Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-slate-500" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by transmittal or code..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div className="text-[11px] font-mono text-slate-500 uppercase flex justify-between px-1">
            <span>Transmittal Record</span>
            <span>Project</span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedItem?.id === item.id
                    ? 'bg-slate-800 border-red-600/70 shadow-md'
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {item.code}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ${
                      item.status === 'active'
                        ? 'text-emerald-400 bg-emerald-950/60'
                        : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="font-medium text-xs text-slate-200 truncate font-mono">
                  {item.name}
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
                  <span className="truncate max-w-[140px]">{item.siteProject}</span>
                  <span>{formatBytes(item.size)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Transmittal Dossier */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">TRANSMITTAL REF:</span>
                    <strong className="text-base font-mono text-red-500">TRN-{selectedItem.code}</strong>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1 font-mono break-all">
                    {selectedItem.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewTransmittalModal(selectedItem)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print Slip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenReceiverWithCode(selectedItem.code, selectedItem.keyFragment)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Open in Decryptor</span>
                  </button>
                </div>
              </div>

              {/* Security & Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                    Project Site / Location
                  </span>
                  <div className="text-white font-semibold text-sm">
                    {selectedItem.siteProject}
                  </div>
                  <span className="text-slate-400 block text-[11px]">
                    Classification: <strong className="text-amber-400">{selectedItem.classification}</strong>
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                    Cryptographic Assurance
                  </span>
                  <div className="text-emerald-400 font-semibold text-sm flex items-center gap-1.5">
                    <ShieldCheck size={16} />
                    <span>AES-256-GCM Zero-Knowledge</span>
                  </div>
                  <span className="text-slate-400 block text-[11px]">
                    Passphrase Protected: {selectedItem.hasPassword ? 'Yes (PBKDF2)' : 'No (Raw AES Key)'}
                  </span>
                </div>
              </div>

              {/* SHA-256 Fingerprint */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                  SHA-256 Cryptographic Integrity Digest
                </span>
                <code className="text-xs text-emerald-400 font-mono break-all block selection:bg-emerald-950 selection:text-emerald-300">
                  {selectedItem.checksumSha256}
                </code>
              </div>

              {/* Audit Chain of Custody */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-3">
                  Chain-of-Custody & Decryption Log ({selectedItem.downloadLog.length} events)
                </h3>
                {selectedItem.downloadLog.length === 0 ? (
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-500 font-mono text-center">
                    No field download events registered yet. Ready for recipient pickup.
                  </div>
                ) : (
                  <div className="space-y-2 font-mono text-xs">
                    {selectedItem.downloadLog.map((log, index) => (
                      <div
                        key={index}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          <div>
                            <span className="text-slate-200 block text-xs font-medium">
                              {log.details}
                            </span>
                            <span className="text-[10px] text-slate-500">{log.location}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(log.timestamp).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs font-mono">
              Select a transmittal from the list to review cryptographic records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
