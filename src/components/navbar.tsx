import { useState } from 'react';
import { Search, Grid, Menu, X, ShieldCheck, ChevronDown, Globe, Phone, Mail, Lock } from 'lucide-react';
import { WebuildSwirl } from './webuild-swirl';

export type MainNavTab = 'home' | 'services' | 'projects' | 'careers' | 'verify' | 'vault' | 'admin';

interface NavbarProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onSearch?: (query: string) => void;
}

export function Navbar({ activeTab, setActiveTab, onSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWorldwideModal, setShowWorldwideModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleNavClick = (tab: MainNavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput);
    }
  };

  const worldwideRegions = [
    { name: 'Australia & Pacific', desc: 'Sydney, Melbourne, Snowy Hydro 2.0, Perth', active: true },
    { name: 'New Zealand', desc: 'Central Interceptor Auckland & rail transit', active: false },
    { name: 'Italy & Europe', desc: 'Milan HQ, Genoa Bridge, Brenner Base Tunnel', active: false },
    { name: 'North America', desc: 'USA & Canada transport and water infrastructure', active: false },
    { name: 'Middle East', desc: 'Riyadh Metro, Red Sea project works', active: false },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200/90 relative z-40">
      {/* 1. TOP UTILITY ROW (Screenshot: Webuild Worldwide button on left, Search on right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between border-b border-slate-100">
        {/* Top-Left: Webuild Worldwide Button with Red Grid Icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowWorldwideModal(!showWorldwideModal)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 border-[1.5px] border-[#d32f2f] text-[#d32f2f] font-semibold text-xs rounded hover:bg-red-50/70 transition-all cursor-pointer shadow-2xs"
            aria-expanded={showWorldwideModal}
          >
            {/* 3x3 Grid Matrix Icon */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="shrink-0">
              <rect x="1" y="1" width="3.2" height="3.2" rx="0.6" />
              <rect x="6.4" y="1" width="3.2" height="3.2" rx="0.6" />
              <rect x="11.8" y="1" width="3.2" height="3.2" rx="0.6" />
              <rect x="1" y="6.4" width="3.2" height="3.2" rx="0.6" />
              <rect x="6.4" y="6.4" width="3.2" height="3.2" rx="0.6" />
              <rect x="11.8" y="6.4" width="3.2" height="3.2" rx="0.6" />
              <rect x="1" y="11.8" width="3.2" height="3.2" rx="0.6" />
              <rect x="6.4" y="11.8" width="3.2" height="3.2" rx="0.6" />
              <rect x="11.8" y="11.8" width="3.2" height="3.2" rx="0.6" />
            </svg>
            <span className="font-sans font-semibold tracking-tight text-[12.5px]">Webuild Worldwide</span>
            <ChevronDown size={13} className={`transition-transform duration-200 ${showWorldwideModal ? 'rotate-180' : ''}`} />
          </button>

          {/* Worldwide Dropdown Panel */}
          {showWorldwideModal && (
            <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-slate-100 font-semibold flex items-center justify-between">
                <span>Select Region</span>
                <Globe size={13} className="text-[#d32f2f]" />
              </div>
              <div className="mt-1 space-y-1">
                {worldwideRegions.map((region) => (
                  <button
                    key={region.name}
                    type="button"
                    onClick={() => {
                      setShowWorldwideModal(false);
                      handleNavClick('home');
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      region.active ? 'bg-red-50 text-[#d32f2f] font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-sans">{region.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{region.desc}</div>
                    </div>
                    {region.active && <span className="w-2 h-2 rounded-full bg-[#d32f2f]"></span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top-Right: Search Box with Gray Field and Red Search Icon */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder=""
              aria-label="Search Webuild"
              className="w-32 sm:w-48 h-7 bg-slate-200/90 focus:bg-white border border-slate-300/80 rounded px-2.5 text-xs text-slate-800 placeholder:text-slate-500 focus:outline-none focus:border-[#d32f2f] transition-all"
            />
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <button
            type="submit"
            className="flex items-center gap-1.5 text-slate-900 hover:text-[#d32f2f] text-xs font-semibold cursor-pointer pl-1 transition-colors"
          >
            <Search size={15} className="text-[#d32f2f] stroke-[2.5]" />
            <span className="font-sans tracking-tight">Search</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <a
            href="tel:+61420127424"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 hover:text-[#d32f2f] transition-colors pl-1"
            title="Call We Build Australia"
          >
            <Phone size={13} className="text-[#d32f2f]" />
            <span>+61 420 127 424</span>
          </a>

          <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

          <a
            href="mailto:info@webuildgroup.company"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-[#d32f2f] transition-colors pl-1"
            title="Email info@webuildgroup.company"
          >
            <Mail size={13} className="text-[#d32f2f]" />
            <span>info@webuildgroup.company</span>
          </a>

          <div className="h-4 w-px bg-slate-200 hidden lg:block"></div>

          <button
            type="button"
            onClick={() => handleNavClick('admin')}
            className={`hidden lg:inline-flex items-center gap-1.5 text-xs font-mono font-bold transition-colors pl-1 cursor-pointer ${
              activeTab === 'admin'
                ? 'text-[#d32f2f]'
                : 'text-slate-600 hover:text-[#d32f2f]'
            }`}
            title="Staff & Admin Portal"
          >
            <Lock size={12} className="text-[#d32f2f]" />
            <span>Admin Portal</span>
          </button>
        </form>
      </div>

      {/* 2. MAIN NAVIGATION ROW WITH CENTRAL CURVED SCOOP & RED SWIRL */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[12.5px] font-bold font-sans tracking-tight">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`transition-colors cursor-pointer uppercase ${
              activeTab === 'home'
                ? 'text-[#111827] border-b-[3px] border-[#d32f2f] pb-1 font-extrabold'
                : 'text-slate-800 hover:text-[#d32f2f]'
            }`}
          >
            WHO WE ARE
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('projects')}
            className={`transition-colors cursor-pointer uppercase ${
              activeTab === 'projects'
                ? 'text-[#111827] border-b-[3px] border-[#d32f2f] pb-1 font-extrabold'
                : 'text-slate-800 hover:text-[#d32f2f]'
            }`}
          >
            PROJECTS
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('services')}
            className={`transition-colors cursor-pointer uppercase ${
              activeTab === 'services'
                ? 'text-[#111827] border-b-[3px] border-[#d32f2f] pb-1 font-extrabold'
                : 'text-slate-800 hover:text-[#d32f2f]'
            }`}
          >
            OUR PRIORITIES
          </button>
        </nav>

        {/* Center Curved Peninsula Scoop with Webuild Red Swirl (Screenshot Signature Element) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 pointer-events-auto">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="relative flex flex-col items-center group cursor-pointer border-0 bg-transparent p-0"
            aria-label="Webuild home"
          >
            {/* Smooth SVG Curved Notch / Scoop dipping down */}
            <svg width="150" height="66" viewBox="0 0 150 66" fill="none" className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
              <path
                d="M0 0C30 0 40 56 75 56C110 56 120 0 150 0H0Z"
                fill="#ffffff"
              />
            </svg>

            {/* Red Swirl Emblem precisely placed inside the curve */}
            <div className="absolute inset-0 flex items-center justify-center pt-2 transition-transform duration-300 group-hover:scale-105">
              <WebuildSwirl size={44} />
            </div>
          </button>
        </div>

        {/* Right Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[12.5px] font-bold font-sans tracking-tight">
          <button
            type="button"
            onClick={() => handleNavClick('careers')}
            className={`transition-colors cursor-pointer uppercase ${
              activeTab === 'careers'
                ? 'text-[#111827] border-b-[3px] border-[#d32f2f] pb-1 font-extrabold'
                : 'text-slate-800 hover:text-[#d32f2f]'
            }`}
          >
            WORK WITH US
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('vault')}
            className={`transition-colors cursor-pointer uppercase ${
              activeTab === 'vault'
                ? 'text-[#111827] border-b-[3px] border-[#d32f2f] pb-1 font-extrabold'
                : 'text-slate-800 hover:text-[#d32f2f]'
            }`}
          >
            TENDERS &amp; VAULT
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('verify')}
            className={`transition-colors cursor-pointer uppercase ${
              activeTab === 'verify'
                ? 'text-[#111827] border-b-[3px] border-[#d32f2f] pb-1 font-extrabold'
                : 'text-slate-800 hover:text-[#d32f2f]'
            }`}
          >
            VERIFY A LETTER
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center justify-between w-full">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2"
          >
            <WebuildSwirl size={32} />
            <span className="font-extrabold text-[#d32f2f] font-sans text-sm tracking-tight">webuild</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-800 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="md:hidden p-4 bg-white border-t border-slate-100 flex flex-col gap-2 font-sans font-bold text-xs uppercase">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-left py-2.5 px-3 rounded hover:bg-slate-50 text-slate-800"
          >
            WHO WE ARE
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('projects')}
            className="text-left py-2.5 px-3 rounded hover:bg-slate-50 text-slate-800"
          >
            PROJECTS
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('services')}
            className="text-left py-2.5 px-3 rounded hover:bg-slate-50 text-slate-800"
          >
            OUR PRIORITIES
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('careers')}
            className="text-left py-2.5 px-3 rounded hover:bg-slate-50 text-slate-800"
          >
            WORK WITH US
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('vault')}
            className="text-left py-2.5 px-3 rounded hover:bg-slate-50 text-slate-800"
          >
            TENDERS &amp; VAULT
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('verify')}
            className="text-left py-2.5 px-3 rounded hover:bg-slate-50 text-slate-800"
          >
            VERIFY A LETTER
          </button>

          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2 font-mono normal-case">
            <a
              href="tel:+61420127424"
              className="flex items-center gap-2 py-2 px-3 rounded bg-slate-50 text-slate-800 font-bold"
            >
              <Phone size={14} className="text-[#d32f2f]" />
              <span>+61 420 127 424</span>
            </a>
            <a
              href="mailto:info@webuildgroup.company"
              className="flex items-center gap-2 py-2 px-3 rounded bg-slate-50 text-slate-800 font-semibold"
            >
              <Mail size={14} className="text-[#d32f2f]" />
              <span>info@webuildgroup.company</span>
            </a>
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-2 py-2 px-3 rounded bg-red-50 text-[#d32f2f] font-bold mt-1"
            >
              <Lock size={14} className="text-[#d32f2f]" />
              <span>STAFF ADMIN PORTAL</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
