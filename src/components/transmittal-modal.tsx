import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Printer, ShieldCheck, Check, Copy, Building2, Calendar, FileText, Download, QrCode } from 'lucide-react';
import { CodedTransferItem } from '@/lib/transfer-store';
import { WEBUILD_COMPANY_DETAILS } from '@/data/webuild-info';
import { formatBytes } from '@/lib/crypto';
import { WebuildLogo } from './webuild-logo';

interface TransmittalModalProps {
  transfer: CodedTransferItem | null;
  onClose: () => void;
}

export function TransmittalModal({ transfer, onClose }: TransmittalModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!transfer) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    let targetBase = origin;
    if (origin.includes('ais-dev-')) {
      targetBase = origin.replace('ais-dev-', 'ais-pre-');
    } else if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      targetBase = 'https://ais-pre-ucblzge2fhhoifdaarjri7-411900850859.asia-southeast1.run.app';
    }
    const verifyUrl = `${targetBase}/#receive?code=${transfer.code}&key=${encodeURIComponent(transfer.keyFragment)}`;
    void QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setQrDataUrl);
  }, [transfer]);

  if (!transfer) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(transfer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 print:p-0 print:shadow-none print:border-none print-receipt">
        {/* Modal Close & Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            Official Transmittal Certificate
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Body (Clean Corporate Stationery Layout) */}
        <div className="pt-6">
          {/* Company Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-amber-500">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight font-sans text-slate-950">
                  WE BUILD <span className="text-amber-500">AUSTRALIA</span>
                </span>
                <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
                  PTY LTD
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-mono">
                ABN: 89 168 514 829 • NSW Fair Trading Builder Licence #274910C • Founded 2014
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Level 19/99 Walker Street, North Sydney NSW 2060 • Tel: +61 420 127 424
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Transmittal Reference
              </span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">
                TRN-{transfer.code}
              </span>
              <span className="text-[11px] text-slate-600 block mt-1">
                Date: {new Date(transfer.created).toLocaleDateString('en-AU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="my-5 text-center">
            <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase block">
              ENGINEERING DOCUMENT TRANSMITTAL & E2EE SECURITY RECEIPT
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Cryptographically Verified Transmittal Record
            </h2>
          </div>

          {/* Key Details Grid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2.5 font-mono mb-5">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Document Title:</span>
              <span className="font-bold text-slate-900 truncate max-w-xs">{transfer.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Project / Site Location:</span>
              <span className="font-semibold text-slate-900">{transfer.siteProject}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Document Classification:</span>
              <span className="font-bold text-red-600">{transfer.classification}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Transfer Access Code:</span>
              <span className="font-extrabold text-base text-slate-900">{transfer.code}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Original Payload Size:</span>
              <span className="text-slate-800">{formatBytes(transfer.size)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Issuer / Transmitting Engineer:</span>
              <span className="text-slate-800">{transfer.senderEmail}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">SHA-256 Cryptographic Hash:</span>
              <span className="text-[10px] text-emerald-700 truncate max-w-xs font-bold" title={transfer.checksumSha256}>
                {transfer.checksumSha256}
              </span>
            </div>
          </div>

          {/* QR Code and Verification Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-100 p-4 rounded-xl border border-slate-200 mb-6">
            <div className="flex justify-center sm:justify-start">
              {qrDataUrl && (
                <div className="bg-white p-1.5 rounded-lg border border-slate-300">
                  <img src={qrDataUrl} alt="Transmittal QR Code" className="w-24 h-24" />
                </div>
              )}
            </div>
            <div className="sm:col-span-2 text-xs text-slate-700 space-y-1">
              <strong className="text-slate-900 block font-semibold">
                On-Site Cryptographic Verification
              </strong>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Authorized Webuild site engineers, client inspectors, and project consultants can scan this QR code or input code <strong>{transfer.code}</strong> into the Webuild Australia secure portal to decrypt and verify the original document.
              </p>
            </div>
          </div>

          {/* Signatures & Certification Block */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Transmitted By</span>
              <div className="h-10 border-b border-slate-400 mt-2"></div>
              <span className="text-[10px] text-slate-600 mt-1 block">We Build Australia Senior Directorate</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Acknowledged / Received By</span>
              <div className="h-10 border-b border-slate-400 mt-2"></div>
              <span className="text-[10px] text-slate-600 mt-1 block">Recipient / Site Officer Signature</span>
            </div>
          </div>

          {/* Compliance Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-500 text-center font-mono">
            Compliant with SafeWork Australia WHS guidelines, Australian Privacy Principles (APPs), and ISO/IEC 27001 Information Security Standard. Zero plaintext stored on remote infrastructure.
          </div>
        </div>
      </div>
    </div>
  );
}
