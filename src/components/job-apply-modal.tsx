import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import {
  X,
  Upload,
  FileCheck2,
  CheckCircle2,
  Building2,
  Briefcase,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  User,
  MapPin,
  Check,
  Printer,
  QrCode,
} from 'lucide-react';
import QRCode from 'qrcode';
import { JobOpening, WE_BUILD_AUSTRALIA_PROFILE } from '@/data/webuild-australia';
import { applicationStore, JobApplication } from '@/lib/application-store';

interface JobApplyModalProps {
  job: JobOpening | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted?: (app: JobApplication) => void;
}

const COMMON_CERTIFICATIONS = [
  'SafeWork NSW White Card',
  'NSW Fair Trading Builder Licence',
  'NSW Fair Trading Supervisor Certificate',
  'Asbestos Awareness (10675NAT)',
  'Working at Heights / Fall Prevention',
  'First Aid & CPR (HLTAID011)',
  'EWP / Boom Lift Ticket',
  'Traffic Control Ticket',
  'TAFE NSW Carpentry / Building Trade',
];

export function JobApplyModal({
  job,
  isOpen,
  onClose,
  onApplicationSubmitted,
}: JobApplyModalProps) {
  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postcode, setPostcode] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [selectedCerts, setSelectedCerts] = useState<string[]>(['SafeWork NSW White Card']);
  const [coverNote, setCoverNote] = useState('');
  const [availableFrom, setAvailableFrom] = useState('Immediate / 2 Weeks Notice');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);
  const [appQrUrl, setAppQrUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleCert = (cert: string) => {
    if (selectedCerts.includes(cert)) {
      setSelectedCerts(selectedCerts.filter((c) => c !== cert));
    } else {
      setSelectedCerts([...selectedCerts, cert]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('Resume file must be under 10MB.');
        return;
      }
      setResumeFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!candidateName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide an Australian contact telephone number.');
      return;
    }
    if (!resumeFile) {
      setError('Please attach your Resume or CV (PDF or Word document).');
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    try {
      const newApp = applicationStore.submit({
        jobId: job ? job.id : 'general-expression',
        jobTitle: job ? job.title : 'General Expression of Interest (All Trades)',
        division: job ? job.division : 'Public Sector & Residential',
        candidateName: candidateName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        suburb: suburb.trim() || 'Sydney',
        state: 'NSW',
        postcode: postcode.trim() || '2000',
        experienceYears,
        certifications: selectedCerts,
        resumeFileName: resumeFile.name,
        resumeFileSize: resumeFile.size,
        coverNote: coverNote.trim(),
        availableFrom,
      });

      setSubmittedApp(newApp);
      if (onApplicationSubmitted) {
        onApplicationSubmitted(newApp);
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('0.0.0.0');
      let targetBase = origin;
      if (origin.includes('ais-dev-')) {
        targetBase = origin.replace('ais-dev-', 'ais-pre-');
      } else if (isLocal) {
        targetBase = 'https://ais-pre-ucblzge2fhhoifdaarjri7-411900850859.asia-southeast1.run.app';
      }
      const statusUrl = `${targetBase}/#verify-status?ref=${newApp.referenceNumber}`;

      void QRCode.toDataURL(statusUrl, {
        width: 240,
        margin: 1,
        color: { dark: '#111827', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      }).then(setAppQrUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedApp(null);
    setAppQrUrl('');
    setCandidateName('');
    setEmail('');
    setPhone('');
    setSuburb('');
    setPostcode('');
    setCoverNote('');
    setResumeFile(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Briefcase size={18} />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                We Build Australia Pty Ltd • Recruitment Portal
              </span>
              <h2 className="text-lg font-bold text-white font-sans">
                {job ? job.title : 'General Expression of Interest'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* SUCCESS CONFIRMATION VIEW */}
        {submittedApp ? (
          <div className="py-6 space-y-6">
            <div className="text-center p-6 bg-emerald-950/40 border border-emerald-600/50 rounded-2xl">
              <div className="w-14 h-14 rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={32} />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                APPLICATION RECEIVED & REGISTERED
              </span>
              <h3 className="text-xl font-bold text-white font-sans">
                Thank you, {submittedApp.candidateName}!
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                Your application for <strong className="text-white">{submittedApp.jobTitle}</strong> has been logged into the We Build Australia senior recruitment system.
              </p>
            </div>

            {/* Reference Badge Card */}
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono">
              <span className="text-[11px] text-slate-500 uppercase tracking-widest block">
                Official Application Reference Number
              </span>
              <div className="text-2xl font-extrabold text-amber-400 tracking-wider my-2">
                {submittedApp.referenceNumber}
              </div>
              <p className="text-[11px] text-slate-400">
                A confirmation has been recorded for {submittedApp.email}. Our senior leadership team reviews every application.
              </p>
            </div>

            {/* Application Summary Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[10px]">Position:</span>
                <span className="text-slate-200 font-semibold">{submittedApp.jobTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Location:</span>
                <span className="text-slate-200">{submittedApp.suburb}, NSW {submittedApp.postcode}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Resume Attached:</span>
                <span className="text-emerald-400 truncate block">{submittedApp.resumeFileName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Availability:</span>
                <span className="text-slate-200">{submittedApp.availableFrom}</span>
              </div>
            </div>

            {/* QR Code to Track Application Status */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-left">
              {appQrUrl ? (
                <img
                  src={appQrUrl}
                  alt={`Scan to check application status of ${submittedApp.referenceNumber}`}
                  className="w-24 h-24 shrink-0 bg-white p-1 rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 shrink-0 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                  Generating QR...
                </div>
              )}
              <div className="space-y-1 font-sans">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <QrCode size={13} className="text-[#d32f2f]" />
                  Scan to Check Application Status
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Scan this QR code with any smartphone camera to open the verification portal directly and monitor your application status anytime using reference <strong className="text-amber-400 font-mono">{submittedApp.referenceNumber}</strong>.
                </p>
                <a
                  href={`#verify-status?ref=${submittedApp.referenceNumber}`}
                  onClick={() => {
                    handleReset();
                    window.location.hash = `#verify-status?ref=${submittedApp.referenceNumber}`;
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 hover:underline pt-0.5 cursor-pointer"
                >
                  <span>Open Verification Portal Now →</span>
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Printer size={14} />
                <span>Print Application Receipt</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition-colors"
              >
                <span>Back to Careers & Openings</span>
              </button>
            </div>
          </div>
        ) : (
          /* APPLICATION FORM */
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Job Summary Banner if specific role selected */}
            {job && (
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-amber-400 font-semibold">{job.division}</span>
                  <span className="text-slate-500 mx-2">•</span>
                  <span className="text-slate-300">{job.location}</span>
                </div>
                <span className="font-mono text-emerald-400 font-medium">{job.salaryRange}</span>
              </div>
            )}

            {/* Candidate Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-500" size={15} />
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Lachlan Murray"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-500" size={15} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lachlan.murray@email.com.au"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Telephone (Mobile) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-slate-500" size={15} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0412 345 678"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Suburb (NSW) *
                </label>
                <input
                  type="text"
                  required
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="e.g. Parramatta / Balmain"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Postcode *
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="2150"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Industry Experience *
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={0}>Apprentice / Junior (0 - 1 year)</option>
                  <option value={2}>1 - 3 years experience</option>
                  <option value={5}>4 - 7 years experience</option>
                  <option value={10}>8+ years senior experience</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Earliest Availability
                </label>
                <input
                  type="text"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  placeholder="e.g. Immediate, or 2 weeks notice"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Certifications Checkbox Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                NSW Trade Tickets & Certifications Held
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_CERTIFICATIONS.map((cert) => {
                  const isChecked = selectedCerts.includes(cert);
                  return (
                    <button
                      type="button"
                      key={cert}
                      onClick={() => handleToggleCert(cert)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-amber-500/20 border-amber-500/80 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isChecked ? <Check size={12} className="text-amber-400" /> : null}
                      <span>{cert}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resume Upload Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Upload Resume / CV (PDF or DOCX) *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  resumeFile
                    ? 'border-emerald-600/80 bg-emerald-950/20'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-950/60'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
                    <FileCheck2 size={18} />
                    <span className="font-semibold truncate max-w-sm">{resumeFile.name}</span>
                    <span className="text-slate-400">({Math.round(resumeFile.size / 1024)} KB)</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload size={20} className="text-slate-400 mb-1" />
                    <span className="text-xs font-medium text-slate-200">
                      Click to browse or drop your Resume here
                    </span>
                    <span className="text-[10px] text-slate-500">PDF, DOC, DOCX up to 10MB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Brief Introduction / Experience Summary
              </label>
              <textarea
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Mention relevant NSW projects, trade specializations, or why you want to build with We Build Australia..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-300">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-mono">
                NSW Fair Trading Builder Licence #274910C • Equal Opportunity Employer
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
              >
                {submitting ? (
                  <span>Registering Application...</span>
                ) : (
                  <>
                    <span>Submit Application to We Build Australia</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
