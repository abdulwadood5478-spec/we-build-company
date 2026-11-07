import { useState } from 'react';
import {
  Landmark,
  Home,
  Pickaxe,
  Baby,
  Building,
  CheckCircle2,
  Award,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { WE_BUILD_AUSTRALIA_PROFILE } from '@/data/webuild-australia';

interface ServicesViewProps {
  onGoToSendTransfer: () => void;
  onGoToCareers: () => void;
}

export function ServicesView({ onGoToSendTransfer, onGoToCareers }: ServicesViewProps) {
  const [activeServiceId, setActiveServiceId] = useState<string>('heritage');

  const getServiceIcon = (icon: string) => {
    switch (icon) {
      case 'Landmark':
        return <Landmark size={22} className="text-[#d97706]" />;
      case 'Home':
        return <Home size={22} className="text-[#d97706]" />;
      case 'Pickaxe':
        return <Pickaxe size={22} className="text-[#d97706]" />;
      case 'Baby':
        return <Baby size={22} className="text-[#d97706]" />;
      case 'Building':
      default:
        return <Building size={22} className="text-[#d97706]" />;
    }
  };

  const activeService =
    WE_BUILD_AUSTRALIA_PROFILE.coreServices.find((s) => s.id === activeServiceId) ||
    WE_BUILD_AUSTRALIA_PROFILE.coreServices[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <p className="eyebrow">
          <span className="dot"></span>CORE CAPABILITIES / NEW SOUTH WALES
        </p>
        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-[#1d352c] mt-2 mb-4 leading-tight">
          What we do across
          <br />
          <em>Sydney &amp; New South Wales.</em>
        </h1>
        <p className="text-sm text-[#68746c] leading-relaxed">
          We Build Australia delivers public sector infrastructure, heritage restorations, civic amenities, and quality residential dwellings. Senior leadership manages each project hands-on from DA approval to final occupation certificate.
        </p>
      </div>

      {/* Services Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        {WE_BUILD_AUSTRALIA_PROFILE.coreServices.map((service) => {
          const isActive = service.id === activeServiceId;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => setActiveServiceId(service.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-[#1d352c] text-white border-[#1d352c] shadow-md'
                  : 'bg-white border-[#d4dbd4] text-[#24382f] hover:border-[#1d352c]'
              }`}
            >
              <div className="mb-3">{getServiceIcon(service.icon)}</div>
              <div>
                <span className="text-xs font-bold block leading-tight font-sans">
                  {service.title}
                </span>
                <span
                  className={`text-[10px] font-mono mt-1 block truncate ${
                    isActive ? 'text-[#bed3c3]' : 'text-[#68746c]'
                  }`}
                >
                  {service.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Service Detailed Spotlight */}
      <div className="bg-white border border-[#d4dbd4] rounded-2xl p-6 sm:p-10 shadow-sm mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#92400e] text-xs font-mono font-semibold">
              <Award size={14} />
              <span>{activeService.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-normal font-serif text-[#1d352c] font-sans">
              {activeService.title}
            </h2>

            <p className="text-sm sm:text-base text-[#d97706] font-medium italic font-sans">
              &ldquo;{activeService.tagline}&rdquo;
            </p>

            <p className="text-sm text-[#68746c] leading-relaxed font-sans">
              {activeService.description}
            </p>

            {/* Deliverables Checklist */}
            <div className="pt-4 border-t border-[#d4dbd4] space-y-2.5">
              <span className="text-xs uppercase font-mono tracking-wider text-[#68746c] block font-semibold">
                Core Deliverables &amp; Specifications:
              </span>
              {activeService.deliverables.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-[#24382f]">
                  <CheckCircle2 size={16} className="text-[#1d352c] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              <button
                type="button"
                onClick={onGoToSendTransfer}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1d352c] hover:bg-[#14241e] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <span>Submit Tender / Project Plans</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={onGoToCareers}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f6f6f1] hover:bg-slate-200 text-[#1d352c] text-xs font-semibold border border-[#d4dbd4] transition-colors cursor-pointer"
              >
                <span>Careers in This Division</span>
              </button>
            </div>
          </div>

          {/* Right Accreditations Card */}
          <div className="lg:col-span-5 bg-[#f6f6f1] p-6 rounded-xl border border-[#d4dbd4] space-y-4">
            <span className="text-xs font-mono text-[#68746c] uppercase tracking-wider block font-semibold">
              NSW Pre-qualification &amp; Accreditations
            </span>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 bg-white rounded border border-[#d4dbd4]">
                <span className="text-[#68746c] block text-[10px]">NSW Government Panel:</span>
                <strong className="text-[#1d352c]">NSW Land and Housing Corporation (LAHC)</strong>
              </div>

              <div className="p-3 bg-white rounded border border-[#d4dbd4]">
                <span className="text-[#68746c] block text-[10px]">Licence &amp; Insurance:</span>
                <strong className="text-[#1d352c]">{WE_BUILD_AUSTRALIA_PROFILE.licenceNumber}</strong>
              </div>

              <div className="p-3 bg-white rounded border border-[#d4dbd4]">
                <span className="text-[#68746c] block text-[10px]">Industry Body:</span>
                <strong className="text-[#1d352c]">{WE_BUILD_AUSTRALIA_PROFILE.masterBuildersMember}</strong>
              </div>

              <div className="p-3 bg-white rounded border border-[#d4dbd4]">
                <span className="text-[#68746c] block text-[10px]">Awards:</span>
                <strong className="text-[#d97706]">National Trust Heritage Award</strong>
              </div>
            </div>

            <div className="p-4 bg-white rounded border border-[#d4dbd4] text-[11px] text-[#68746c] space-y-1">
              <span className="font-semibold text-[#1d352c] block font-sans">Public Sector &amp; Council Tenders</span>
              <p className="leading-relaxed">
                Contact our senior estimating team to request capability statements, pre-qualification documentation, or to invite We Build Australia to upcoming council tenders.
              </p>
              <div className="pt-1 text-[#1d352c] font-mono text-[11px] font-bold">
                Tel: {WE_BUILD_AUSTRALIA_PROFILE.headOffice.phone}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Pillar Grid Overview */}
      <div className="my-12">
        <div className="max-w-2xl mb-8">
          <p className="eyebrow">
            <span className="dot"></span>ALL DIVISIONS
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1d352c] mt-1 font-normal">
            Five Core Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WE_BUILD_AUSTRALIA_PROFILE.coreServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-white border border-[#d4dbd4] rounded-xl p-6 flex flex-col justify-between hover:border-[#1d352c] transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2.5 bg-[#f6f6f1] rounded-lg border border-[#d4dbd4]">
                    {getServiceIcon(service.icon)}
                  </span>
                  <span className="text-xs font-mono text-[#68746c] font-bold">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1d352c] font-sans mb-1.5">
                  {service.title}
                </h3>

                <p className="text-xs text-[#68746c] leading-relaxed font-sans mb-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#d4dbd4] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#d97706] font-semibold">
                  {service.badge}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveServiceId(service.id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-[#1d352c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
