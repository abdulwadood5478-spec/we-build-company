import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  Copy,
  Check,
  QrCode,
  Download,
  Trash2,
  Lock,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  FileCode,
  FilePlus2,
  Building2,
  Clock,
  MoreVertical,
  ExternalLink,
  Printer,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { formatBytes } from '@/lib/crypto';
import { CodedTransferItem, transferStore } from '@/lib/transfer-store';
import { WEBUILD_AUSTRALIA_PROJECTS } from '@/data/webuild-info';

interface FileManagerProps {
  onSendNewClick: () => void;
  onOpenReceiverWithCode: (code: string, keyFragment?: string) => void;
  onViewTransmittalModal: (item: CodedTransferItem) => void;
}

export function FileManager({
  onSendNewClick,
  onOpenReceiverWithCode,
  onViewTransmittalModal,
}: FileManagerProps) {
  const [transfers, setTransfers] = useState<CodedTransferItem[]>(() => transferStore.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'downloaded' | 'expired' | 'revoked'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Refresh transfers list
  const refreshTransfers = () => {
    setTransfers(transferStore.getAll());
  };

  // Filtered and searched items
  const filteredTransfers = useMemo(() => {
    return transfers.filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Project filter
      if (projectFilter !== 'all' && item.siteProject !== projectFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCode = item.code.toLowerCase().includes(query);
        const matchesProject = item.siteProject.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesSender = item.senderEmail.toLowerCase().includes(query);
        return matchesName || matchesCode || matchesProject || matchesCategory || matchesSender;
      }
      return true;
    });
  }, [transfers, statusFilter, projectFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalFiles = transfers.length;
    const totalBytes = transfers.reduce((acc, t) => acc + t.size, 0);
    const activeCount = transfers.filter((t) => t.status === 'active').length;
    const totalDownloads = transfers.reduce((acc, t) => acc + t.downloadCount, 0);
    return {
      totalFiles,
      totalBytes: formatBytes(totalBytes),
      activeCount,
      totalDownloads,
    };
  }, [transfers]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id: string, name: string) => {
    if (confirm(`Revoke encrypted access to "${name}"? The coded key will immediately be disabled.`)) {
      transferStore.revokeTransfer(id);
      refreshTransfers();
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Permanently delete "${name}" from your local vault?`)) {
      transferStore.deleteTransfer(id);
      refreshTransfers();
    }
  };

  const getFileIcon = (mimeType: string, name: string) => {
    const lower = name.toLowerCase();
    if (lower.endsWith('.dwg') || lower.endsWith('.dxf') || lower.endsWith('.cad')) {
      return <FileCode className="text-red-400" size={18} />;
    }
    if (lower.endsWith('.xlsx') || lower.endsWith('.csv') || lower.endsWith('.xls')) {
      return <FileSpreadsheet className="text-emerald-400" size={18} />;
    }
    return <FileText className="text-blue-400" size={18} />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Building2 size={13} className="text-amber-400" />
            <span>We Build Australia Tender & Document Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Minimalist File Management Interface
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Centralized register of client-encrypted engineering transmittals, active job codes, and document audit records across all Australian sites.
          </p>
        </div>

        <button
          type="button"
          onClick={onSendNewClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 transition-all cursor-pointer shrink-0"
        >
          <FilePlus2 size={16} />
          <span>New Encrypted Transfer</span>
        </button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
            Active Transmittals
          </span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {stats.activeCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Live on Australian network</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
            Encrypted Volume
          </span>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {stats.totalBytes}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Zero-knowledge storage</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
            Total Vault Files
          </span>
          <div className="text-2xl font-bold text-slate-200 font-mono mt-1">
            {stats.totalFiles}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Civil specs, CAD, BIM, HSE</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
            Decrypted Pickups
          </span>
          <div className="text-2xl font-bold text-red-400 font-mono mt-1">
            {stats.totalDownloads}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Site engineers & consultants</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by filename, code (e.g. WB-849-201), project site, or sender..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Project Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Australian Projects</option>
              {WEBUILD_AUSTRALIA_PROJECTS.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Table List View"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Grid Card View"
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto text-xs">
          <span className="text-[11px] text-slate-500 uppercase font-mono mr-1">Status:</span>
          {(['all', 'active', 'downloaded', 'expired', 'revoked'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {status}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-slate-500 font-mono">
            Showing {filteredTransfers.length} of {transfers.length}
          </span>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10.5px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Document / Transmittal</th>
                  <th className="py-3.5 px-4 font-semibold">Transfer Code</th>
                  <th className="py-3.5 px-4 font-semibold">Australian Project</th>
                  <th className="py-3.5 px-4 font-semibold">Size</th>
                  <th className="py-3.5 px-4 font-semibold">Downloads</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No encrypted documents match your query.
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Document Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="shrink-0">{getFileIcon(item.mimeType, item.name)}</div>
                          <div className="truncate max-w-xs sm:max-w-sm">
                            <span className="font-semibold text-white block truncate" title={item.name}>
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate font-mono">
                              {item.category} • {item.classification}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {item.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(item.code, item.id)}
                            className="text-slate-500 hover:text-slate-200 cursor-pointer"
                            title="Copy code"
                          >
                            {copiedId === item.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>

                      {/* Project */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-slate-300 font-medium">{item.siteProject}</span>
                      </td>

                      {/* Size */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {formatBytes(item.size)}
                      </td>

                      {/* Downloads */}
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        <span className="text-slate-300">
                          {item.downloadCount} / {item.maxDownloads || '∞'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            item.status === 'active'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                              : item.status === 'downloaded'
                              ? 'bg-blue-950/80 text-blue-400 border border-blue-800'
                              : item.status === 'expired'
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : 'bg-red-950/80 text-red-400 border border-red-800'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Decrypt & Open */}
                          <button
                            type="button"
                            onClick={() => onOpenReceiverWithCode(item.code, item.keyFragment)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Decrypt & Download"
                          >
                            <Download size={14} />
                          </button>

                          {/* Transmittal Slip */}
                          <button
                            type="button"
                            onClick={() => onViewTransmittalModal(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="View Transmittal Record"
                          >
                            <Printer size={14} />
                          </button>

                          {/* Revoke */}
                          {item.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => handleRevoke(item.id, item.name)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                              title="Revoke Transfer Code"
                            >
                              <Lock size={14} />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                            title="Delete file record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTransfers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
              No encrypted documents match your query.
            </div>
          ) : (
            filteredTransfers.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm relative group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                        item.status === 'active'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : item.status === 'expired'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-red-950/80 text-red-400 border border-red-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {item.status}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {item.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(item.code, item.id)}
                        className="text-slate-500 hover:text-white cursor-pointer"
                        title="Copy code"
                      >
                        {copiedId === item.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="my-4">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">{getFileIcon(item.mimeType, item.name)}</div>
                      <h3 className="font-semibold text-white text-sm break-all font-mono line-clamp-2">
                        {item.name}
                      </h3>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-400 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Project:</span>
                        <span className="text-slate-200 truncate max-w-[180px]">{item.siteProject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Size:</span>
                        <span className="text-slate-200">{formatBytes(item.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Downloads:</span>
                        <span className="text-slate-200">
                          {item.downloadCount} / {item.maxDownloads || '∞'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenReceiverWithCode(item.code, item.keyFragment)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Decrypt</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewTransmittalModal(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="Transmittal Slip"
                    >
                      <Printer size={13} />
                    </button>
                    {item.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(item.id, item.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                        title="Revoke Code"
                      >
                        <Lock size={13} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
