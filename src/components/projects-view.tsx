import { useState } from 'react';
import { Building2, MapPin, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WE_BUILD_AUSTRALIA_PROFILE } from '@/data/webuild-australia';

interface ProjectsViewProps {
  onGoToSendTransfer: () => void;
  onGoToCareers: () => void;
}

export function ProjectsView({ onGoToSendTransfer, onGoToCareers }: ProjectsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Heritage Restoration',
    'Social & Public Housing',
    'Civil & Stormwater',
    'Childcare & Community',
    'Residential Building',
  ];

  const filteredProjects = WE_BUILD_AUSTRALIA_PROFILE.projects.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <p className="eyebrow">
          <span className="dot"></span>NSW PORTFOLIO / CIVIC &amp; RESIDENTIAL
        </p>
        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-[#1d352c] mt-2 mb-4 leading-tight">
          Proven delivery across
          <br />
          <em>Sydney &amp; New South Wales.</em>
        </h1>
        <p className="text-sm text-[#68746c] leading-relaxed">
          From award-winning heritage restorations along Sydney Harbour to social housing modernizations and vital stormwater infrastructure, explore how We Build Australia builds lasting value for our communities.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1d352c] text-white font-bold'
                : 'bg-white border border-[#d4dbd4] text-[#68746c] hover:border-[#1d352c]'
            }`}
          >
            {cat === 'all' ? 'All Projects' : cat}
          </button>
        ))}
      </div>

      {/* Projects Showcase Cards */}
      <div className="space-y-10">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-[#d4dbd4] rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-stretch"
          >
            {/* Visual Cover */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden bg-slate-950">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center"
              />

              {project.awardOrBadge && (
                <div className="absolute top-4 left-4 bg-[#1d352c] text-[#bed3c3] px-3 py-1.5 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 shadow">
                  <Award size={13} className="text-[#d97706]" />
                  <span>{project.awardOrBadge}</span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-slate-900/80 backdrop-blur-sm p-2 rounded">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#d97706]" />
                  {project.location}
                </span>
                <span>Year: {project.yearCompleted}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#f6f6f1] border border-[#d4dbd4] text-[#1d352c] text-xs font-mono font-semibold">
                    {project.category}
                  </span>
                  <span className="text-xs text-[#68746c] font-mono">
                    Client: <strong className="text-[#1d352c]">{project.client}</strong>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif text-[#1d352c] font-normal">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#68746c] leading-relaxed font-sans">
                  {project.description}
                </p>

                {/* Highlights */}
                <div className="pt-3 border-t border-[#d4dbd4] space-y-1.5 font-mono text-xs text-[#24382f]">
                  <span className="text-[10px] text-[#68746c] uppercase block font-semibold">
                    Key Outcomes &amp; Innovations:
                  </span>
                  {project.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-[#1d352c] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-[#d4dbd4] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono text-[#68746c]">
                  We Build Australia Pty Ltd • Est. 2014
                </span>

                <button
                  type="button"
                  onClick={onGoToSendTransfer}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1d352c] hover:bg-[#14241e] text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  <span>Submit Tender Plans</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
