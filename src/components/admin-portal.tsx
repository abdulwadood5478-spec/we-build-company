import { useState, useMemo, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  User,
  KeyRound,
  LogOut,
  FolderOpen,
  Download,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Trash2,
  Eye,
  FileText,
  FileCheck2,
  ArrowRight,
  ExternalLink,
  Briefcase,
  Building2,
  RefreshCw,
  Send,
  MessageSquare,
  AlertCircle,
  Check,
} from 'lucide-react';
import {
  verificationStore,
  VerificationSubmission,
} from '@/lib/verification-store';
import {
  applicationStore,
  JobApplication,
} from '@/lib/application-store';
import { formatBytes } from '@/lib/crypto';
import { WE_BUILD_AUSTRALIA_PROFILE } from '@/data/webuild-australia';

interface AdminPortalProps {
  onBackToSite: () => void;
}

export function AdminPortal({ onBackToSite }: AdminPortalProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('wba_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard State
  const [adminTab, setAdminTab] = useState<'verifications' | 'applications'>('verifications');
  const [verifications, setVerifications] = useState<VerificationSubmission[]>(() =>
    verificationStore.getAll()
  );
  const [applications, setApplications] = useState<JobApplication[]>(() =>
    applicationStore.getAll()
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'verified' | 'flagged'>('all');
  const [selectedVerification, setSelectedVerification] = useState<VerificationSubmission | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const refreshData = async () => {
    await verificationStore.refreshFromServer();
    setVerifications(verificationStore.getAll());
    setApplications(applicationStore.getAll());
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    void refreshData();
    const interval = window.setInterval(() => void refreshData(), 5000);
    return () => window.clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const userClean = username.trim();
    if (
      userClean.toLowerCase() === 'pablo team' &&
      password === 'Pablo@3009'
    ) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('wba_admin_auth', 'true');
      }
    } else {
      setAuthError('Invalid username or password. Access is restricted to authorized personnel.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('wba_admin_auth');
    }
  };

  // Download submitted file
  const handleDownloadFile = (sub: VerificationSubmission) => {
    if (sub.fileDataUrl) {
      const a = document.createElement('a');
      a.href = sub.fileDataUrl;
      a.download = sub.fileName || 'Submitted_Document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const content = `WE BUILD AUSTRALIA PTY LTD - DOCUMENT SUBMISSION RECORD
Reference Code: ${sub.refCode}
Candidate: ${sub.candidateName}
Email for Reply: ${sub.email}
Phone: ${sub.phone || 'N/A'}
Position/Title: ${sub.position || 'General Verification'}
Attached Document: ${sub.fileName} (${formatBytes(sub.fileSize)})
Submitted Date: ${new Date(sub.submittedAt).toLocaleString('en-AU')}
Current Status: ${sub.status.toUpperCase()}
Agency/Source: ${sub.agencyOrConsultant || 'Direct Submission'}
Candidate Notes: ${sub.notes || 'None'}
Admin Notes: ${sub.adminReplyNotes || 'Pending Directorate Review'}
----------------------------------------------------------------------
We Build Australia Pty Ltd • Head Office: Level 19/99 Walker Street, North Sydney NSW 2060
Contact: +61 420 127 424 | info@webuildgroup.company`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sub.fileName.replace(/\.[^/.]+$/, '')}_Audit_Record.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Update verification status
  const handleUpdateStatus = (
    id: string,
    newStatus: VerificationSubmission['status'],
    note?: string
  ) => {
    verificationStore.updateStatus(id, newStatus, note);
    refreshData();
    if (selectedVerification && selectedVerification.id === id) {
      setSelectedVerification((prev) =>
        prev ? { ...prev, status: newStatus, adminReplyNotes: note || prev.adminReplyNotes } : null
      );
    }
  };

  const copyText = (val: string, refId: string) => {
    navigator.clipboard.writeText(val);
    setCopiedRef(refId);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  // Filtered verifications
  const filteredVerifications = useMemo(() => {
    return verifications.filter((v) => {
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          v.candidateName.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q) ||
          v.refCode.toLowerCase().includes(q) ||
          v.fileName.toLowerCase().includes(q) ||
          (v.position && v.position.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [verifications, statusFilter, searchQuery]);

  // Statistics
  const pendingCount = verifications.filter((v) => v.status === 'pending_review').length;
  const verifiedCount = verifications.filter((v) => v.status === 'verified').length;
  const flaggedCount = verifications.filter((v) => v.status === 'flagged').length;

  // ==============================================================
  // 1. LOGIN SCREEN
  // ==============================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-950 text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d32f2f] to-red-500 mx-auto flex items-center justify-center shadow-lg shadow-red-900/30">
              <Lock size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white font-sans">
              We Build Australia Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Internal HR Directorate &amp; Verification Submissions Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#d32f2f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#d32f2f]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#d32f2f] hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
            >
              <ShieldCheck size={16} />
              <span>Sign In to Admin Portal</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              ← Return to public website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // ==============================================================
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Top Admin Navigation Bar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#d32f2f] flex items-center justify-center font-bold text-white shadow-2xs">
              WB
            </div>
            <div>
              <span className="text-[11px] font-mono text-red-400 font-bold block uppercase tracking-wider">
                Internal Directorate Console
              </span>
              <h1 className="text-sm font-bold text-white font-sans">
                We Build Australia • Applications &amp; Verifications Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-300 font-medium block">
                Signed in as <strong className="text-white">Administrator</strong>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                HR Directorate North Sydney
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 hover:text-white border border-slate-700 font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-lg bg-[#d32f2f] hover:bg-red-700 text-xs text-white font-bold cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Public Website</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
              Total Verifications
            </span>
            <strong className="text-2xl font-mono text-slate-900 block mt-1">
              {verifications.length}
            </strong>
            <span className="text-[11px] text-slate-500">Documents submitted</span>
          </div>

          <div className="bg-white border border-amber-300 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-mono text-amber-700 uppercase block font-semibold flex items-center gap-1">
              <Clock size={13} />
              Pending Review
            </span>
            <strong className="text-2xl font-mono text-amber-700 block mt-1">
              {pendingCount}
            </strong>
            <span className="text-[11px] text-amber-700">Awaiting HR determination</span>
          </div>

          <div className="bg-white border border-emerald-300 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-mono text-emerald-700 uppercase block font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} />
              Verified / Authentic
            </span>
            <strong className="text-2xl font-mono text-emerald-700 block mt-1">
              {verifiedCount}
            </strong>
            <span className="text-[11px] text-emerald-700">Official offers confirmed</span>
          </div>

          <div className="bg-white border border-red-300 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-mono text-red-700 uppercase block font-semibold flex items-center gap-1">
              <AlertTriangle size={13} />
              Flagged / Counterfeit
            </span>
            <strong className="text-2xl font-mono text-red-700 block mt-1">
              {flaggedCount}
            </strong>
            <span className="text-[11px] text-red-700">Suspicious documents</span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAdminTab('verifications')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                adminTab === 'verifications'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCheck2 size={15} />
              <span>Document Verification Submissions</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#d32f2f] text-white text-[10px] font-mono font-bold">
                {verifications.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAdminTab('applications')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                adminTab === 'applications'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Briefcase size={15} />
              <span>Job Applications</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-300 text-slate-800 text-[10px] font-mono font-bold">
                {applications.length}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={refreshData}
            title="Refresh database"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: DOCUMENT VERIFICATIONS                                  */}
        {/* ============================================================== */}
        {adminTab === 'verifications' && (
          <div className="space-y-4">
            {/* Search and Filter Row */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by candidate name, reply email, reference code (WBA-VER-...), or file name..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#d32f2f]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">Status:</span>
                {(['all', 'pending_review', 'verified', 'flagged'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'All'
                      : st === 'pending_review'
                      ? 'Pending'
                      : st === 'verified'
                      ? 'Verified'
                      : 'Flagged'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions List */}
            {filteredVerifications.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
                <FolderOpen size={32} className="mx-auto text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800">No verification documents found</h3>
                <p className="text-xs text-slate-500">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No submissions matched your search criteria.'
                    : 'No candidate documents have been uploaded yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredVerifications.map((item) => {
                  const replyMailto = `mailto:${item.email}?subject=We Build Australia Document Verification Determination [${item.refCode}]&body=Dear ${encodeURIComponent(
                    item.candidateName
                  )},%0D%0A%0D%0AWe Build Australia HR Directorate has completed the verification review for document "${encodeURIComponent(
                    item.fileName
                  )}" (Reference ID: ${item.refCode}).%0D%0A%0D%0ADetermination: ${
                    item.status === 'verified'
                      ? 'OFFICIALLY VERIFIED & AUTHENTIC'
                      : item.status === 'flagged'
                      ? 'UNAUTHORIZED / SUSPICIOUS'
                      : 'PENDING FURTHER INFORMATION'
                  }%0D%0A%0D%0ANotes: ${encodeURIComponent(
                    item.adminReplyNotes || 'Document authenticated against NSW Operations Directorate records.'
                  )}%0D%0A%0D%0APlease contact our North Sydney office at +61 420 127 424 if you require additional documentation.%0D%0A%0D%0ARegards,%0D%0AWe Build Australia Pty Ltd HR Directorate%0D%0Ainfo@webuildgroup.company%0D%0ALevel 19/99 Walker Street, North Sydney NSW 2060`;

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-4 sm:p-5 transition-all shadow-2xs space-y-3"
                    >
                      {/* Top Header of Record */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                            {item.refCode}
                          </span>

                          {item.status === 'verified' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 size={12} /> VERIFIED AUTHENTIC
                            </span>
                          ) : item.status === 'flagged' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-mono font-bold border border-red-300 flex items-center gap-1">
                              <AlertTriangle size={12} /> FLAGGED / SUSPICIOUS
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold border border-amber-300 flex items-center gap-1">
                              <Clock size={12} /> PENDING HR DETERMINATION
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400 font-mono">
                          Submitted: {new Date(item.submittedAt).toLocaleString('en-AU', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Main Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Candidate Info */}
                        <div className="md:col-span-4 space-y-1">
                          <strong className="text-sm font-bold text-slate-900 block font-sans">
                            {item.candidateName}
                          </strong>
                          <div className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
                            <Mail size={13} className="text-[#d32f2f] shrink-0" />
                            <a
                              href={replyMailto}
                              className="text-blue-600 hover:underline font-bold"
                              title="Click to email reply to candidate"
                            >
                              {item.email}
                            </a>
                          </div>
                          {item.phone && (
                            <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                              <Phone size={13} className="text-slate-400 shrink-0" />
                              <span>{item.phone}</span>
                            </div>
                          )}
                          {item.position && (
                            <div className="text-[11px] text-slate-500 font-sans">
                              Role: <strong className="text-slate-700">{item.position}</strong>
                            </div>
                          )}
                        </div>

                        {/* Uploaded Document Info & Download */}
                        <div className="md:col-span-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                              <FileText size={18} />
                            </div>
                            <div className="truncate">
                              <strong className="text-xs text-slate-900 block truncate font-mono">
                                {item.fileName}
                              </strong>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {formatBytes(item.fileSize)} • {item.fileType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadFile(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1 shadow-2xs transition-colors"
                            title="Download candidate's uploaded file"
                          >
                            <Download size={13} />
                            <span>Download</span>
                          </button>
                        </div>

                        {/* Status Actions & Email Reply */}
                        <div className="md:col-span-4 flex flex-wrap items-center justify-end gap-2">
                          {/* Direct Email Reply Button */}
                          <a
                            href={replyMailto}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                            title="Send email reply to candidate"
                          >
                            <Send size={13} />
                            <span>Reply to Candidate</span>
                          </a>

                          {/* Quick Status Toggles */}
                          {item.status !== 'verified' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, 'verified', 'Approved by Directorate')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold cursor-pointer"
                              title="Mark as authentic offer letter"
                            >
                              ✓ Verify
                            </button>
                          )}

                          {item.status !== 'flagged' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, 'flagged', 'Flagged as unauthorized by Directorate')}
                              className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 text-xs font-semibold cursor-pointer"
                              title="Flag as counterfeit/unauthorized"
                            >
                              ✗ Flag
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVerification(item);
                              setAdminNoteInput(item.adminReplyNotes || '');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                            title="Inspect full details & notes"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete verification submission ${item.refCode}?`)) {
                                verificationStore.delete(item.id);
                                refreshData();
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer"
                            title="Delete submission"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Candidate Note if provided */}
                      {item.notes && (
                        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/60 font-sans">
                          <strong className="text-slate-800">Candidate inquiry note:</strong> {item.notes}
                        </div>
                      )}

                      {/* Admin Note if provided */}
                      {item.adminReplyNotes && (
                        <div className="text-xs text-emerald-900 bg-emerald-50/60 p-2 rounded border border-emerald-200 font-sans flex items-center justify-between">
                          <span>
                            <strong>Directorate Note:</strong> {item.adminReplyNotes}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-mono">
                            {item.reviewedAt ? new Date(item.reviewedAt).toLocaleDateString('en-AU') : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: JOB APPLICATIONS                                        */}
        {/* ============================================================== */}
        {adminTab === 'applications' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  NSW Construction Job Applications ({applications.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Applications received for We Build Australia heritage, social housing, and civil works.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {app.referenceNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                        {app.status}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-600">
                        {app.division}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      Applied: {new Date(app.appliedAt).toLocaleDateString('en-AU')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 space-y-1">
                      <strong className="text-sm font-bold text-slate-900 block font-sans">
                        {app.candidateName} — {app.jobTitle}
                      </strong>
                      <div className="text-xs font-mono text-slate-600 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Mail size={12} className="text-[#d32f2f]" />
                          <a href={`mailto:${app.email}`} className="text-blue-600 hover:underline">
                            {app.email}
                          </a>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={12} />
                          {app.phone}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Location: {app.suburb}, {app.state} {app.postcode} • Experience: {app.experienceYears} Years
                      </div>
                    </div>

                    <div className="md:col-span-4">
                      <div className="text-[11px] font-mono text-slate-500 mb-1">Certifications:</div>
                      <div className="flex flex-wrap gap-1">
                        {app.certifications.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2">
                      <a
                        href={`mailto:${app.email}?subject=We Build Australia Application Update [${app.referenceNumber}]`}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Mail size={13} />
                        <span>Email Candidate</span>
                      </a>
                    </div>
                  </div>

                  {app.coverNote && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 font-sans">
                      <strong>Cover Note:</strong> {app.coverNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* INSPECT & EDIT VERIFICATION AUDIT MODAL                         */}
      {/* ============================================================== */}
      {selectedVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#d32f2f]" />
                DIRECTORATE VERIFICATION AUDIT &amp; RESPONSE
              </span>
              <button
                type="button"
                onClick={() => setSelectedVerification(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking Code:</span>
                  <strong className="text-slate-900">{selectedVerification.refCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate Name:</span>
                  <strong className="text-slate-900">{selectedVerification.candidateName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate Email for Reply:</span>
                  <strong className="text-blue-700">{selectedVerification.email}</strong>
                </div>
                {selectedVerification.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <strong className="text-slate-900">{selectedVerification.phone}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Attached File:</span>
                  <strong className="text-slate-900">{selectedVerification.fileName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">File Size:</span>
                  <strong className="text-slate-900">{formatBytes(selectedVerification.fileSize)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted:</span>
                  <strong className="text-slate-900">
                    {new Date(selectedVerification.submittedAt).toLocaleString('en-AU')}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span
                    className={`font-bold ${
                      selectedVerification.status === 'verified'
                        ? 'text-emerald-700'
                        : selectedVerification.status === 'flagged'
                        ? 'text-red-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {selectedVerification.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Admin Note Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800 font-sans">
                  Directorate Verification Findings &amp; Email Reply Note:
                </label>
                <textarea
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  rows={3}
                  placeholder="Enter official Directorate determination findings to store with this record..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#d32f2f]"
                />
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-slate-500 text-xs mr-1">Update Status:</span>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedVerification.id, 'verified', adminNoteInput)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  ✓ Mark Verified Authentic
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedVerification.id, 'flagged', adminNoteInput)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                >
                  ✗ Flag Counterfeit
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedVerification.id, 'pending_review', adminNoteInput)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Pending
                </button>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleDownloadFile(selectedVerification)}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Download Document</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVerification(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
