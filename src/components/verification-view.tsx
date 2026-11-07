import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  Upload,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Lock,
  Printer,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  FileImage,
  Mail,
  Phone,
  HelpCircle,
  FileCheck2,
  QrCode,
  Smartphone,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import { WE_BUILD_AUSTRALIA_PROFILE } from '@/data/webuild-australia';
import {
  verificationStore,
  VerificationSubmission,
} from '@/lib/verification-store';
import { applicationStore, JobApplication } from '@/lib/application-store';
import { formatBytes } from '@/lib/crypto';

interface VerificationViewProps {
  onGoToAdmin?: () => void;
  initialShowQrModal?: boolean;
}

const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.docx', '.doc'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export function VerificationView({ onGoToAdmin, initialShowQrModal }: VerificationViewProps) {
  // Submission Form State
  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [context, setContext] = useState('');
  const [notes, setNotes] = useState('');

  // Official QR Code State
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [portalUrl, setPortalUrl] = useState<string>('');
  const [copiedQrLink, setCopiedQrLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [submittedStatusQr, setSubmittedStatusQr] = useState<string>('');
  const qrSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const statusSectionRef = useRef<HTMLDivElement>(null);

  // Generate QR Code encoding direct link to Verify & Status Portal (using public Shared App URL so any phone can access it)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('0.0.0.0');
      // When accessed from development session (ais-dev) or localhost, use the public Shared App URL (ais-pre) so external mobile devices can open it freely without 404
      let targetBase = origin;
      if (origin.includes('ais-dev-')) {
        targetBase = origin.replace('ais-dev-', 'ais-pre-');
      } else if (isLocal) {
        targetBase = 'https://ais-pre-ucblzge2fhhoifdaarjri7-411900850859.asia-southeast1.run.app';
      }

      const directUrl = `${targetBase}/#verify-status`;
      setPortalUrl(directUrl);

      void QRCode.toDataURL(directUrl, {
        width: 320,
        margin: 1,
        color: { dark: '#111827', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      }).then(setQrDataUrl);
    }
  }, []);

  // When visiting #verify, #verify-status, #verify-form, or passing ?ref=..., route smoothly to appropriate section
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkHashAndParams = () => {
      const hash = window.location.hash || '';
      const search = window.location.search || '';

      // Check if reference code is passed via query or hash params (e.g. ?ref=WBA-APP-2026-7841)
      let refParam = '';
      if (search) {
        const params = new URLSearchParams(search);
        refParam = params.get('ref') || params.get('code') || '';
      }
      if (!refParam && hash.includes('?')) {
        const queryPart = hash.slice(hash.indexOf('?') + 1);
        const params = new URLSearchParams(queryPart);
        refParam = params.get('ref') || params.get('code') || '';
      }

      if (refParam) {
        setStatusSearchCode(refParam);
        handleLookupStatus(refParam);
        setTimeout(() => {
          statusSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 250);
      } else if (hash.includes('status')) {
        setTimeout(() => {
          statusSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      } else if (hash.includes('verify-form')) {
        setTimeout(() => {
          formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      } else if (hash.includes('verify') && !hash.includes('qr')) {
        setTimeout(() => {
          formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    };

    checkHashAndParams();
    window.addEventListener('hashchange', checkHashAndParams);
    return () => window.removeEventListener('hashchange', checkHashAndParams);
  }, []);

  // Auto-scroll or open if requested from Verification QR button
  useEffect(() => {
    if (initialShowQrModal || (typeof window !== 'undefined' && window.location.hash.includes('qr'))) {
      setTimeout(() => {
        qrSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [initialShowQrModal]);

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'We_Build_Australia_Verification_Portal_QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyQrUrl = () => {
    if (!portalUrl) return;
    navigator.clipboard.writeText(portalUrl);
    setCopiedQrLink(true);
    setTimeout(() => setCopiedQrLink(false), 2000);
  };

  // Uploaded file state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status Check lookup state (supports both Verification Submissions and Job Applications)
  type StatusLookupResult =
    | { type: 'verification'; data: VerificationSubmission }
    | { type: 'application'; data: JobApplication }
    | null;

  const [statusSearchCode, setStatusSearchCode] = useState('');
  const [statusResult, setStatusResult] = useState<StatusLookupResult>(null);
  const [statusSearched, setStatusSearched] = useState(false);

  // Submitted confirmation state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRefCode, setSubmittedRefCode] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  // File processing and validation
  const handleProcessFile = (file: File) => {
    setUploadError(null);

    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File is too large (${formatBytes(file.size)}). Maximum supported file size is 25 MB.`);
      return;
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isAccepted =
      ACCEPTED_EXTENSIONS.includes(ext) ||
      file.type.includes('pdf') ||
      file.type.includes('image') ||
      file.type.includes('word') ||
      file.type.includes('officedocument');

    if (!isAccepted) {
      setUploadError(
        `Unsupported file format (${ext || file.type}). Please attach a document in PDF, Word (.docx), or image (.png, .jpg) format.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile(file);
      setFileName(file.name);
      setFileSize(file.size);
      setFileType(file.type || 'application/pdf');
      setFileDataUrl(reader.result as string);
    };
    reader.onerror = () => {
      setUploadError('Failed to read selected file. Please ensure you have read permission.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileName('');
    setFileSize(0);
    setFileType('');
    setFileDataUrl('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit document for company verification
  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !email.trim()) return;

    if (!fileName) {
      setUploadError('Please attach your offer letter or document before submitting.');
      return;
    }

    const generatedRef = `WBA-VER-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Store in verification store for the Admin Portal
    verificationStore.add({
      refCode: generatedRef,
      candidateName: candidateName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      position: position.trim() || undefined,
      fileName: fileName,
      fileSize: fileSize || 1024000,
      fileType: fileType || 'application/pdf',
      fileDataUrl: fileDataUrl || undefined,
      agencyOrConsultant: context.trim() || undefined,
      notes: notes.trim() || undefined,
      status: 'pending_review',
    });

    setSubmittedRefCode(generatedRef);
    setIsSubmitted(true);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('0.0.0.0');
    let targetBase = origin;
    if (origin.includes('ais-dev-')) {
      targetBase = origin.replace('ais-dev-', 'ais-pre-');
    } else if (isLocal) {
      targetBase = 'https://ais-pre-ucblzge2fhhoifdaarjri7-411900850859.asia-southeast1.run.app';
    }
    const statusUrl = `${targetBase}/#verify-status?ref=${generatedRef}`;

    void QRCode.toDataURL(statusUrl, {
      width: 260,
      margin: 1,
      color: { dark: '#111827', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then(setSubmittedStatusQr);

    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const copyRefCode = () => {
    navigator.clipboard.writeText(submittedRefCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `======================================================================
WE BUILD AUSTRALIA PTY LTD (ACN 168 514 829)
DOCUMENT VERIFICATION LODGEMENT RECEIPT
======================================================================

Tracking Reference Code : ${submittedRefCode}
Date & Time Lodged      : ${new Date().toLocaleString('en-AU')}
Candidate Full Name     : ${candidateName}
Reply-To Email Address  : ${email}
Contact Phone Number    : ${phone || 'Not provided'}
Position / Role Title   : ${position || 'General Verification'}
Attached Document       : ${fileName} (${formatBytes(fileSize)})
Agency / Referral Source: ${context || 'Direct Submission'}

OFFICIAL COMPANY NOTICE:
Your document has been securely registered with the We Build Australia
HR Directorate. Our verification team will review this document against
official New South Wales operational registers and project records.

An official verification determination will be sent directly to your
registered email address (${email}) from info@webuildgroup.company within
1 to 2 business days.

Company Contact:
We Build Australia Pty Ltd
Level 19/99 Walker Street, North Sydney NSW 2060
Phone: +61 420 127 424 | Email: info@webuildgroup.company
NSW Fair Trading Builder Licence: #274910C
======================================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submittedRefCode}_Lodgement_Receipt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Status check lookup (searches both verification submissions and job applications)
  const handleLookupStatus = (rawQuery?: string) => {
    const query = (rawQuery !== undefined ? rawQuery : statusSearchCode).trim();
    if (!query) return;

    // Check verification submissions first
    const verFound = verificationStore.getByRef(query);
    if (verFound) {
      setStatusResult({ type: 'verification', data: verFound });
      setStatusSearched(true);
      return;
    }

    // Check job applications next
    const appFound = applicationStore.getByReference(query);
    if (appFound) {
      setStatusResult({ type: 'application', data: appFound });
      setStatusSearched(true);
      return;
    }

    setStatusResult(null);
    setStatusSearched(true);
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookupStatus();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-left">
        <p className="eyebrow">
          <span className="dot"></span>RECRUITMENT &amp; DOCUMENT AUTHENTICATION
        </p>
        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-[#1d352c] mt-2 mb-3 leading-tight">
          Job letter &amp; contract
          <br />
          <em>verification portal.</em>
        </h1>
        <p className="text-sm leading-relaxed text-[#68746c] max-w-3xl">
          We Build Australia Pty Ltd provides direct verification for employment offer letters, trade engagements, and subcontractor credentials. Upload your document with your contact details below, and our senior HR Directorate will review the document and send an official determination directly to your email.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Informational Sidebar - Mobile order-2, Desktop lg:order-1 */}
        <div className="order-2 lg:order-1 lg:col-span-5 space-y-6">
          <div className="p-5 bg-white border border-[#d4dbd4] rounded-xl shadow-xs space-y-3.5">
            <strong className="text-xs uppercase font-mono tracking-wider text-[#1d352c] block font-bold">
              How Company Verification Works:
            </strong>

            <div className="space-y-3 text-xs text-[#24382f]">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1d352c] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="block text-[#1d352c]">Upload Your Document &amp; Email</strong>
                  <span className="text-[#68746c]">
                    Provide your full legal name, the email address where you want to receive our response, and attach your letter (PDF, Word, or image).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#d32f2f] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="block text-[#1d352c]">HR Directorate Authentication</strong>
                  <span className="text-[#68746c]">
                    Our leadership cross-references the offer with official project staffing registers, NSW licences, and authorized signatories.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="block text-[#1d352c]">Official Email Determination</strong>
                  <span className="text-[#68746c]">
                    You receive an official verification response sent directly to your email from <code>info@webuildgroup.company</code>.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= OFFICIAL VERIFICATION QR SECTION ================= */}
          <div
            id="verification-qr-section"
            ref={qrSectionRef}
            className="p-5 bg-white border-2 border-[#1d352c] rounded-2xl shadow-sm space-y-3.5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <strong className="text-xs uppercase font-mono tracking-wider text-[#1d352c] flex items-center gap-2 font-bold">
                <QrCode size={16} className="text-[#d32f2f]" />
                Application &amp; Verification QR
              </strong>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300 flex items-center gap-1">
                <Smartphone size={11} /> SCAN TO CHECK STATUS
              </span>
            </div>

            <div className="text-center space-y-2.5">
              {/* QR Image Box */}
              <div
                onClick={() => setShowQrModal(true)}
                className="relative inline-block p-3 bg-white rounded-xl border border-slate-200 shadow-2xs group cursor-pointer"
                title="Click to enlarge QR code"
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Scan to check application status or open verification portal"
                    className="w-48 h-48 mx-auto object-contain rounded"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-xs font-mono text-slate-400">
                    Generating QR...
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 bg-white/95 rounded-md text-[10px] font-mono font-bold text-slate-800 shadow-sm flex items-center gap-1">
                    <Maximize2 size={11} /> Click to Enlarge
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1">
                <strong className="text-xs font-bold text-[#1d352c] block font-sans">
                  Check Application Status via Mobile
                </strong>
                <p className="text-[11px] leading-relaxed text-[#68746c]">
                  Want to check the status of your application or verify an employment offer? Point any smartphone camera (iPhone or Android) at this QR code to immediately open the verification portal on your mobile device.
                </p>
              </div>

              {/* Direct Link Display */}
              <div className="p-2 bg-[#f6f6f1] rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 flex items-center justify-between gap-2 overflow-hidden text-left">
                <span className="truncate">{portalUrl || 'https://...#verify-status'}</span>
                <button
                  type="button"
                  onClick={handleCopyQrUrl}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-300 shrink-0 cursor-pointer transition-colors"
                >
                  {copiedQrLink ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="w-full py-2 px-3 rounded-lg bg-[#1d352c] hover:bg-[#14241e] text-white text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download size={13} />
                  <span>Save QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Maximize2 size={13} />
                  <span>Enlarge</span>
                </button>
              </div>
            </div>
          </div>

          {/* Guarantee & Anti-Fraud Notice */}
          <div className="p-4 bg-[#fbfbf9] border border-[#d4dbd4] rounded-xl text-xs text-[#68746c] space-y-1.5">
            <strong className="text-[#1d352c] block font-sans font-bold flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-700" />
              Official Guarantee &amp; Anti-Fraud Protection
            </strong>
            <p className="leading-relaxed">
              We Build Australia Pty Ltd never charges candidate application fees, visa deposits, or background check costs. All official company communications come exclusively from <strong>info@webuildgroup.company</strong> or telephone <strong>+61 420 127 424</strong>.
            </p>
          </div>

          {/* Check Existing Reference Code Status */}
          <div
            id="status-check-section"
            ref={statusSectionRef}
            className="p-5 bg-white border border-[#d4dbd4] rounded-xl shadow-xs space-y-3 scroll-mt-24"
          >
            <div className="flex items-center justify-between">
              <strong className="text-xs font-mono uppercase text-[#1d352c] block font-bold flex items-center gap-1.5">
                <Search size={14} className="text-[#d32f2f]" />
                Check Application &amp; Verification Status
              </strong>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Live Status Tracker
              </span>
            </div>
            <p className="text-xs text-[#68746c]">
              Already lodged an application or offer letter? Enter your tracking reference code below (e.g. <code>WBA-APP-2026-XXXX</code> or <code>WBA-VER-2026-XXXX</code>):
            </p>

            <form onSubmit={handleCheckStatus} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={statusSearchCode}
                  onChange={(e) => setStatusSearchCode(e.target.value)}
                  placeholder="e.g. WBA-APP-2026-7841 or WBA-VER-2026-948201"
                  className="flex-1 bg-[#f6f6f1] border border-[#d4dbd4] rounded-lg px-3 py-2 text-xs font-mono text-[#24382f] focus:outline-none focus:border-[#1d352c]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-[#1d352c] hover:bg-[#14241e] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Check Status
                </button>
              </div>
            </form>

            {statusSearched && (
              <div className="pt-2 text-xs font-mono border-t border-slate-100">
                {statusResult ? (
                  statusResult.type === 'verification' ? (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Document Verification</span>
                        <span className="text-[10px] font-mono font-bold text-slate-700">{statusResult.data.refCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Candidate:</span>
                        <strong className="text-slate-800">{statusResult.data.candidateName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Document:</span>
                        <strong className="text-slate-800 truncate max-w-[150px]">{statusResult.data.fileName}</strong>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-500">Current Status:</span>
                        {statusResult.data.status === 'verified' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            ✓ VERIFIED AUTHENTIC
                          </span>
                        ) : statusResult.data.status === 'flagged' ? (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                            ✗ FLAGGED SUSPICIOUS
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                            ⏳ UNDER REVIEW BY HR
                          </span>
                        )}
                      </div>
                      {statusResult.data.adminReplyNotes && (
                        <div className="text-[11px] text-slate-600 pt-1 font-sans border-t border-slate-200 mt-1">
                          <strong>HR Note:</strong> {statusResult.data.adminReplyNotes}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Employment Application</span>
                        <span className="text-[10px] font-mono font-bold text-amber-700">{statusResult.data.referenceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Candidate:</span>
                        <strong className="text-slate-800">{statusResult.data.candidateName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Role:</span>
                        <strong className="text-slate-800 truncate max-w-[170px]">{statusResult.data.jobTitle}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Division:</span>
                        <span className="text-slate-700">{statusResult.data.division}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-500">Current Status:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {statusResult.data.status === 'Shortlisted' ? '⭐ Shortlisted for Interview' :
                           statusResult.data.status === 'Interview Scheduled' ? '📅 Interview Scheduled' :
                           statusResult.data.status === 'Approved' ? '✓ Approved for Onboarding' :
                           statusResult.data.status === 'Verification in Progress' ? '🔍 Verification in Progress' :
                           '⏳ Application Received & Registered'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 pt-1 font-sans border-t border-slate-200 mt-1">
                        <strong>Directorate Update:</strong> Official communications are dispatched directly to {statusResult.data.email}.
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-800 text-[11px]">
                    No submission record or application found for tracking code <strong>{statusSearchCode}</strong>. Please ensure the reference is entered correctly (e.g. WBA-APP-2026-XXXX or WBA-VER-2026-XXXX).
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Discrete Link to Staff / Admin Portal */}
          {onGoToAdmin && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onGoToAdmin}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 mx-auto font-mono hover:underline cursor-pointer"
              >
                <Lock size={12} className="text-slate-400" />
                <span>We Build Australia Staff Portal (Password Protected) →</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Main Interactive Form - Directly accessible via QR Scan & Mobile order-1 */}
        <div
          id="verify-job-letter-section"
          ref={formSectionRef}
          className="order-1 lg:order-2 lg:col-span-7 bg-white border-2 border-[#1d352c] rounded-2xl p-6 sm:p-8 shadow-sm scroll-mt-24"
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmitVerification} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="px-2.5 py-1 rounded bg-[#e8f0ea] text-[#1d352c] text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <BadgeCheck size={13} className="text-[#1d352c]" />
                  VERIFY JOB LETTER SECTION
                </span>
                <span className="text-[11px] font-mono text-[#68746c]">
                  NSW Fair Trading Licence #274910C
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#1d352c] font-sans">
                Verify Your Job Offer Letter
              </h2>
              <p className="text-xs text-[#68746c]">
                Please enter your registered details, the email where company HR should send your verification response, and attach your document.
              </p>

              {/* Candidate Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1d352c] mb-1">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your full legal name as written on the letter"
                  className="w-full bg-[#f6f6f1] border border-[#d4dbd4] rounded-lg p-2.5 text-xs text-[#24382f] focus:outline-none focus:border-[#1d352c]"
                />
              </div>

              {/* Email Where Company Will Reply */}
              <div>
                <label className="block text-xs font-semibold text-[#1d352c] mb-1">
                  Email Address (Where you need to get reply from company) *
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-[#d32f2f]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-[#f6f6f1] border border-[#d4dbd4] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#24382f] focus:outline-none focus:border-[#1d352c]"
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Our HR Directorate will send the formal verification determination to this email from info@webuildgroup.company
                </span>
              </div>

              {/* Phone & Position in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1d352c] mb-1">
                    Contact Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0420 127 424"
                      className="w-full bg-[#f6f6f1] border border-[#d4dbd4] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#24382f] focus:outline-none focus:border-[#1d352c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d352c] mb-1">
                    Position or Role Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Senior Site Manager, Project Engineer"
                    className="w-full bg-[#f6f6f1] border border-[#d4dbd4] rounded-lg p-2.5 text-xs text-[#24382f] focus:outline-none focus:border-[#1d352c]"
                  />
                </div>
              </div>

              {/* DOCUMENT UPLOAD DROPZONE */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#1d352c]">
                    Upload Offer Letter or Contract Document *
                  </label>
                  <span className="text-[10px] font-mono text-[#68746c]">
                    Max 25 MB
                  </span>
                </div>

                {/* Hidden input element */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  aria-label="Upload document file"
                />

                {!fileName ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#1d352c] bg-emerald-50/50 scale-[1.01]'
                        : 'border-slate-300 hover:border-[#1d352c] bg-[#f9faf9] hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-[#1d352c] mb-2.5 shadow-2xs">
                      <Upload size={22} />
                    </div>
                    <span className="text-xs font-bold text-[#1d352c] block mb-0.5">
                      Drag &amp; drop your offer letter here, or{' '}
                      <span className="text-[#c5160e] underline">browse files</span>
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Supports PDF files, Word contracts (.docx), and scan images (.png, .jpg) up to 25 MB
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        {fileType.includes('image') ? (
                          <FileImage size={20} />
                        ) : (
                          <FileText size={20} />
                        )}
                      </div>
                      <div className="truncate">
                        <strong className="text-xs text-emerald-950 block truncate font-sans">
                          {fileName}
                        </strong>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-800">
                          <span>{formatBytes(fileSize)}</span>
                          <span>•</span>
                          <span className="uppercase">{fileName.split('.').pop() || 'PDF'}</span>
                          <span>•</span>
                          <span className="text-emerald-700 flex items-center gap-0.5 font-bold">
                            <Check size={11} /> Ready for submission
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-[11px] rounded bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Recruitment Agency / Origin */}
              <div>
                <label className="block text-xs font-semibold text-[#1d352c] mb-1">
                  Recruitment Agency or Consultant Name (Optional)
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Hays Sydney, Kelly Services, Seek, or Direct Contact"
                  className="w-full bg-[#f6f6f1] border border-[#d4dbd4] rounded-lg p-2.5 text-xs text-[#24382f] focus:outline-none focus:border-[#1d352c]"
                />
              </div>

              {/* Notes / Questions */}
              <div>
                <label className="block text-xs font-semibold text-[#1d352c] mb-1">
                  Additional Notes or Questions for HR (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any details about your start date, remuneration, or suspected fraudulent contact..."
                  className="w-full bg-[#f6f6f1] border border-[#d4dbd4] rounded-lg p-2.5 text-xs text-[#24382f] focus:outline-none focus:border-[#1d352c]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#1d352c] hover:bg-[#14241e] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShieldCheck size={16} />
                  <span>Submit Document for Company Verification</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </form>
          ) : (
            /* LODGEMENT CONFIRMATION CARD */
            <div className="space-y-5 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-[#d4dbd4] pb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> DOCUMENT SUCCESSFULLY LODGED
                </span>
                <span className="text-[#68746c]">{new Date().toLocaleDateString('en-AU')}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-[#68746c] uppercase block font-bold">
                  We Build Australia Pty Ltd • Directorate Verification Queue
                </span>
                <h3 className="text-2xl font-serif text-[#1d352c] font-normal font-sans">
                  {candidateName}
                </h3>
                <p className="text-[#68746c] font-sans">
                  Reply will be sent to: <strong className="text-blue-700">{email}</strong>
                </p>
              </div>

              <div className="p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl text-xs leading-relaxed text-[#1f2937] font-sans space-y-2">
                <strong className="text-[#065f46] block text-sm">
                  What Happens Next?
                </strong>
                <p>
                  Your document <strong>{fileName}</strong> has been logged into our secure Directorate verification register under Tracking Reference <strong>{submittedRefCode}</strong>.
                </p>
                <p>
                  Our senior HR team in North Sydney will review the document against our official project contracts and authorized NSW directorate signatories. You will receive an official verification determination directly at <strong>{email}</strong> from <strong>info@webuildgroup.company</strong> within 1–2 business days.
                </p>
              </div>

              {/* Reference Box */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#f6f6f1] rounded-xl border border-[#d4dbd4] text-[11px]">
                <div>
                  <span className="text-[#68746c] block">Tracking Reference Code:</span>
                  <strong className="text-[#1d352c] text-sm">{submittedRefCode}</strong>
                </div>
                <div>
                  <span className="text-[#68746c] block">Attached Document:</span>
                  <strong className="text-[#1d352c] truncate block">{fileName}</strong>
                </div>
              </div>

              {/* QR Code to Track Application / Document Status */}
              <div className="p-4 bg-white border border-[#d4dbd4] rounded-xl flex flex-col sm:flex-row items-center gap-4 text-left">
                {submittedStatusQr ? (
                  <img
                    src={submittedStatusQr}
                    alt={`Scan to check status of ${submittedRefCode}`}
                    className="w-24 h-24 shrink-0 object-contain p-1 border border-slate-200 rounded-lg shadow-2xs bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 shrink-0 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                    Generating QR...
                  </div>
                )}
                <div className="space-y-1 font-sans">
                  <span className="text-xs font-bold text-[#1d352c] flex items-center gap-1.5 font-mono">
                    <QrCode size={14} className="text-[#d32f2f]" />
                    Scan to Track Verification Status
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Scan this QR code with any smartphone to open the verification portal directly on your mobile device and check the review status for <strong>{submittedRefCode}</strong> anytime.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusSearchCode(submittedRefCode);
                      handleLookupStatus(submittedRefCode);
                      setIsSubmitted(false);
                      setTimeout(() => {
                        statusSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 200);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1d352c] hover:underline pt-0.5 cursor-pointer"
                  >
                    <span>Check Live Status in Portal Now →</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copyRefCode}
                  className="px-3.5 py-2 rounded-lg bg-white border border-[#d4dbd4] text-[#1d352c] text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  {copiedRef ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiedRef ? 'Copied Reference!' : 'Copy Tracking Reference'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="px-3.5 py-2 rounded-lg bg-[#1d352c] hover:bg-[#14241e] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download Lodgement Receipt</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCandidateName('');
                    setEmail('');
                    setPhone('');
                    setPosition('');
                    setFileName('');
                    setUploadedFile(null);
                    setFileDataUrl('');
                    setNotes('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  + Submit another document for verification
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded QR Modal & Printable Notice */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 print:p-0 print:border-none print-receipt">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 no-print">
              <span className="text-xs font-mono font-bold text-[#1d352c] flex items-center gap-1.5">
                <QrCode size={16} className="text-[#d32f2f]" />
                APPLICATION &amp; VERIFICATION SCANNER
              </span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="text-center space-y-3 font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                  We Build Australia Pty Ltd (ACN 168 514 829)
                </span>
                <h3 className="text-xl font-bold text-[#1d352c] font-sans">
                  Application Status &amp; Verification Portal
                </h3>
                <span className="text-xs text-slate-500 block">
                  NSW Fair Trading Builder Licence #274910C
                </span>
              </div>

              {/* Large Crisp QR Image */}
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 inline-block shadow-md">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="We Build Australia Verification Portal QR Code"
                    className="w-56 h-56 mx-auto object-contain"
                  />
                )}
              </div>

              <div className="space-y-1 text-xs text-slate-700 font-sans">
                <strong className="block text-[#1d352c]">Instant Mobile Access:</strong>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Scan this QR code with any smartphone camera (iPhone or Android) to open the verification portal directly on your phone and track your application or document status.
                </p>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-600 truncate mt-1">
                  {portalUrl}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-200 no-print gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Printer size={13} />
                <span>Print Placard</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyQrUrl}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Copy size={13} />
                  <span>{copiedQrLink ? 'Copied Link!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="px-3.5 py-2 rounded-lg bg-[#1d352c] hover:bg-[#14241e] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Save QR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
