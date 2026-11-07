import { useState } from 'react';
import {
  Briefcase,
  MapPin,
  CheckCircle2,
  HardHat,
  Search,
  Phone,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { WE_BUILD_AUSTRALIA_PROFILE } from '@/data/webuild-australia';

export function CareersView() {
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const divisions = [
    { id: 'all', label: 'All NSW Opportunities' },
    { id: 'Heritage Restoration', label: 'Heritage Restoration' },
    { id: 'Social Housing', label: 'Social & Public Housing' },
    { id: 'Civil & Stormwater', label: 'Civil & Stormwater' },
    { id: 'Childcare & Community', label: 'Childcare & Community' },
    { id: 'Residential', label: 'Residential & Townhouses' },
  ];

  const filteredJobs = WE_BUILD_AUSTRALIA_PROFILE.jobOpenings.filter((job) => {
    if (selectedDivision !== 'all' && job.division !== selectedDivision) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        job.title.toLowerCase().includes(q) ||
        job.summary.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.division.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero Header */}
      <div className="max-w-3xl mb-12">
        <p className="eyebrow">
          <span className="dot"></span>CAREERS / BUILD WITH US
        </p>
        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-[#1d352c] mt-2 mb-4 leading-tight">
          Work that
          <br />
          <em>builds tomorrow.</em>
        </h1>
        <p className="text-sm text-[#68746c] leading-relaxed">
          Founded in 2014, We Build Australia delivers public sector infrastructure, heritage restorations, civic amenities, and quality residential dwellings across Sydney and New South Wales. Explore our current career opportunities below.
        </p>

        {/* Culture Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#d4dbd4] text-xs font-mono">
          <div>
            <span className="text-[#1d352c] font-bold text-xl block">2014</span>
            <span className="text-[#68746c]">Founded in NSW</span>
          </div>
          <div>
            <span className="text-[#d97706] font-bold text-xl block">Award</span>
            <span className="text-[#68746c]">National Trust Winner</span>
          </div>
          <div>
            <span className="text-[#1d352c] font-bold text-xl block">LAHC</span>
            <span className="text-[#68746c]">Housing Panel Builder</span>
          </div>
          <div>
            <span className="text-[#1d352c] font-bold text-xl block">100%</span>
            <span className="text-[#68746c]">Senior Leadership</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#d4dbd4] rounded-xl p-4 sm:p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-[#68746c]" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search positions by trade, title, location, or keywords..."
              className="w-full bg-[#f6f6f1] border border-[#d4dbd4] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#24382f] placeholder:text-[#68746c] focus:outline-none focus:border-[#1d352c]"
            />
          </div>

          <div className="text-xs font-mono text-[#68746c] flex items-center gap-2">
            <Phone size={14} className="text-[#1d352c]" />
            <span>Recruitment Enquiries: <strong>{WE_BUILD_AUSTRALIA_PROFILE.headOffice.phone}</strong></span>
          </div>
        </div>

        {/* Division Filter Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#d4dbd4] overflow-x-auto text-xs">
          {divisions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDivision(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedDivision === d.id
                  ? 'bg-[#1d352c] text-white font-bold'
                  : 'bg-[#f6f6f1] text-[#68746c] hover:text-[#1d352c] hover:bg-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-[#68746c] font-mono hidden sm:inline">
            {filteredJobs.length} roles available
          </span>
        </div>
      </div>

      {/* Job Openings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-[#d4dbd4] hover:border-[#1d352c] rounded-xl p-6 transition-all flex flex-col justify-between shadow-sm"
          >
            <div>
              {/* Card Badge Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded bg-[#f6f6f1] border border-[#d4dbd4] text-[#1d352c] text-[11px] font-mono font-semibold">
                  {job.division}
                </span>
                <span className="text-xs text-[#68746c] font-mono">{job.type}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-[#1d352c] font-sans">
                {job.title}
              </h2>

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-3 my-3 text-xs text-[#68746c] font-mono">
                <span className="flex items-center gap-1 text-[#24382f]">
                  <MapPin size={13} className="text-[#d97706]" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="text-[#1d352c] font-semibold">{job.salaryRange}</span>
              </div>

              <p className="text-xs text-[#68746c] leading-relaxed mt-3 mb-4 font-sans">
                {job.summary}
              </p>

              {/* Key Requirements Highlights */}
              <div className="space-y-1.5 pt-3 border-t border-[#d4dbd4] mb-4">
                <span className="text-[10px] uppercase font-mono text-[#68746c] block font-semibold">
                  Key Requirements:
                </span>
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-[#24382f]">
                    <CheckCircle2 size={12} className="text-[#1d352c] mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Position Details Footer */}
            <div className="pt-4 border-t border-[#d4dbd4] flex items-center justify-between text-xs font-mono text-[#68746c]">
              <span>Req ID: {job.id.toUpperCase()}</span>
              <span>NSW Fair Trading Licence #274910C</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recruitment Contact Information */}
      <div className="p-6 bg-white border border-[#d4dbd4] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <ShieldCheck size={22} className="text-[#1d352c] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#1d352c] block font-sans text-sm">
              Official We Build Australia Recruitment Inquiries
            </strong>
            <p className="text-[#68746c] text-xs mt-1">
              For employment inquiries, apprenticeships, and trade submissions, please contact our North Sydney head office at <strong>{WE_BUILD_AUSTRALIA_PROFILE.headOffice.phone}</strong> or visit Level 19/99 Walker Street, North Sydney NSW 2060.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
