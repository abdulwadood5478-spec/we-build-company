import { ArrowUpRight, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { WE_BUILD_AUSTRALIA_PROFILE } from '@/data/webuild-australia';

interface HomeViewProps {
  onGoToCareers: () => void;
  onGoToServices: () => void;
  onGoToProjects: () => void;
  onGoToVerify: () => void;
}

export function HomeView({
  onGoToCareers,
  onGoToServices,
  onGoToProjects,
  onGoToVerify,
}: HomeViewProps) {
  // Department cards matching the 2x2 grid in Screenshot 1
  const deptCards = [
    {
      title: 'Site Manager – Heritage Restoration',
      tag: 'HERITAGE RESTORATION',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=700&q=80',
    },
    {
      title: 'Project Manager – Social Housing',
      tag: 'SOCIAL & PUBLIC HOUSING',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80',
    },
    {
      title: 'Civil & Stormwater Superintendent',
      tag: 'CIVIL & STORMWATER',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=700&q=80',
    },
    {
      title: 'Community Facilities Lead',
      tag: 'CHILDCARE & COMMUNITY',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
    },
  ];

  return (
    <main className="bg-white">
      {/* ================= EXACT STARTING SETTING MATCHING REFERENCE IMAGE ================= */}
      <section className="pt-8 sm:pt-12 pb-4 text-center">
        {/* Centered Pill Breadcrumbs (Screenshot: Homepage > Who We Are > Our Regions > Webuild in Australia) */}
        <div className="inline-flex items-center justify-center">
          <div className="px-6 py-2 rounded-full bg-slate-100/90 border border-slate-200/60 shadow-2xs text-xs font-sans">
            <button
              type="button"
              onClick={onGoToServices}
              className="text-[#c5160e] hover:underline font-semibold cursor-pointer"
            >
              Homepage
            </button>
            <span className="mx-2 text-slate-400 font-normal">›</span>
            <button
              type="button"
              onClick={onGoToServices}
              className="text-[#c5160e] hover:underline font-semibold cursor-pointer"
            >
              Who We Are
            </button>
            <span className="mx-2 text-slate-400 font-normal">›</span>
            <span className="text-[#c5160e] font-semibold">Our Regions</span>
            <span className="mx-2 text-slate-400 font-normal">›</span>
            <span className="text-slate-500 font-medium">Webuild in Australia</span>
          </div>
        </div>

        {/* Giant Main Title (Screenshot: "Webuild in New Zealand" -> "Webuild in Australia") */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal font-sans tracking-tight text-[#111827] mt-8 mb-10 text-center max-w-5xl mx-auto px-4">
          Webuild in Australia
        </h1>

        {/* Front / First Image (Underneath the giant title with rounded top corners, matching screenshot) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="overflow-hidden rounded-t-[32px] sm:rounded-t-[40px] shadow-lg border border-slate-200/80 bg-slate-950">
            <img
              src="/assets/aistudio/image_bca5133f.png"
              alt="Sydney Harbour Bridge and city skyline - Webuild projects in Australia"
              loading="eager"
              className="w-full h-[360px] sm:h-[480px] lg:h-[580px] object-cover object-[center_35%]"
            />
          </div>
        </div>
      </section>

      {/* ================= 2. SECTION 01: PIONEERING / MISSION (SCREENSHOT 2) ================= */}
      <section className="pioneering section-rail">
        <p className="eyebrow">
          <span className="dot"></span>01 / PUBLIC SECTOR &amp; CIVIC MISSION
        </p>

        <div>
          <h2>
            Built on experience.
            <br />
            Driven by <em>what&apos;s next.</em>
          </h2>

          <p className="body-copy">
            We Build Australia (We Build Australia Pty Ltd) is a New South Wales-based construction company founded in 2014 that delivers public sector, civic, and residential building projects across Sydney and New South Wales. Focused on preserving heritage assets, improving social housing, and supporting local neighborhoods with a hands-on senior leadership team managing projects from conception to handover.
          </p>

          <button
            type="button"
            onClick={onGoToServices}
            className="text-link"
          >
            Our story, our ambition <ArrowUpRight size={18} />
          </button>

          {/* Facts Counters */}
          <div className="facts">
            <div>
              <strong>2014</strong>
              <span>Founded in NSW</span>
            </div>
            <div>
              <strong>Award</strong>
              <span>National Trust Winner</span>
            </div>
            <div>
              <strong>LAHC</strong>
              <span>NSW Housing Panel Builder</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Hands-on Senior Leadership</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. SECTION 02: WHAT WE DO (DARK FOREST RAIL) ================= */}
      <section className="future section-rail">
        <div>
          <p className="eyebrow">
            <span className="dot"></span>02 / FIVE CORE CAPABILITIES
          </p>
          <h2>
            Public value.
            <br />
            Enduring <em>quality.</em>
          </h2>
          <p>
            Built to deliver high-quality infrastructure and building works for the public sector, government agencies, local councils, and housing bodies across Sydney and regional NSW.
          </p>

          <button
            type="button"
            onClick={onGoToServices}
            className="text-link"
          >
            Explore our capabilities <ArrowUpRight size={19} />
          </button>

          <div className="heritage-graphic" aria-hidden="true">
            <span>NSW</span>
            <small>PUBLIC SECTOR &amp; CIVIC</small>
          </div>
        </div>

        {/* 5 Core Pillars as requested */}
        <div className="expertise-list">
          {[
            {
              num: '01',
              title: 'Heritage Restoration',
              desc: 'Restoring and conserving historical and heritage-listed buildings across Sydney (recognized by awards such as the National Trust Heritage Award).',
            },
            {
              num: '02',
              title: 'Social & Public Housing Remediation',
              desc: 'Upgrading, remediating, and modernizing occupied public and social housing units for bodies such as the NSW Land and Housing Corporation (LAHC).',
            },
            {
              num: '03',
              title: 'Civil Infrastructure & Stormwater Works',
              desc: 'Executing civil works, stormwater management, detention systems, and sewer/flood-zone remediation for local councils.',
            },
            {
              num: '04',
              title: 'Childcare & Community Facilities',
              desc: 'Building purpose-built early education childcare centers and public-use community infrastructure complying with National Quality Standards.',
            },
            {
              num: '05',
              title: 'Residential Building',
              desc: 'Constructing custom architectural homes, side-by-side duplexes, boutique townhouses, and secondary dwellings (granny flats).',
            },
          ].map((item) => (
            <button
              key={item.num}
              type="button"
              onClick={onGoToServices}
              className="expertise-item"
            >
              <span className="eyebrow">{item.num}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <ArrowUpRight size={22} className="text-[#bed3c3]" />
            </button>
          ))}
        </div>
      </section>

      {/* ================= 4. SECTION 03: WORK SITES / FIELD CRAFTSMANSHIP ================= */}
      <section className="work-sites" aria-labelledby="work-sites-title">
        <div className="work-sites-heading">
          <p className="eyebrow">
            <span className="dot"></span>OUR PEOPLE / IN THE FIELD
          </p>
          <div>
            <h2 id="work-sites-title">Craftsmanship at work.</h2>
            <p>
              From the drawing board to occupied social housing and award-winning heritage sites, our senior team brings hands-on leadership, safety, and collaboration to every project across New South Wales.
            </p>
          </div>
        </div>

        <div className="work-sites-images">
          <figure>
            <img
              src="https://images.hostinger.com/e74eff18-7607-46e6-8f13-d2cd04b41863/b5f95daf-ed4a-4584-a54f-3bf767090087.png"
              alt="We Build Australia project managers and engineers reviewing technical drawings on site"
              loading="lazy"
            />
            <figcaption>Senior leadership &amp; stakeholder collaboration on site</figcaption>
          </figure>

          <figure>
            <img
              src="https://images.hostinger.com/e74eff18-7607-46e6-8f13-d2cd04b41863/6b069342-1a02-4711-836f-baea477ea708.png"
              alt="Tradespeople executing structural reinforcement and civil stormwater works"
              loading="lazy"
            />
            <figcaption>Civil remediation, stormwater &amp; heritage structural works</figcaption>
          </figure>
        </div>
      </section>

      {/* ================= 5. SECTION 04: CAREERS (EXACT REPLICA OF SCREENSHOT 1) ================= */}
      <section id="careers" className="careers section-rail">
        <div className="careers-intro">
          <p className="eyebrow">
            <span className="dot"></span>03 / BUILD YOUR FUTURE
          </p>

          <h2>
            Work that
            <br />
            <em>builds tomorrow.</em>
          </h2>

          <p>
            Join a New South Wales-rooted construction group where community heritage and public sector impact meet a forward-looking purpose. We are hiring across heritage restoration, social housing remediation, civil &amp; stormwater, and residential project delivery.
          </p>

          <button
            type="button"
            onClick={onGoToCareers}
            className="text-link"
          >
            View all openings <ArrowUpRight size={18} />
          </button>

          {/* Contact Details (Screenshot 1: address with link + phone) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '28px' }}>
            <a
              href="https://maps.google.com/?q=Level+19+99+Walker+Street+North+Sydney+NSW+2060"
              target="_blank"
              rel="noopener noreferrer"
              className="careers-address"
              title="Open We Build Australia office on Google Maps"
            >
              <MapPin size={15} />
              <span>Level 19/99 Walker Street, North Sydney NSW 2060 ↗</span>
            </a>

            <a
              href={`tel:${WE_BUILD_AUSTRALIA_PROFILE.headOffice.phone}`}
              className="careers-address"
              title="Call We Build Australia Head Office"
            >
              <Phone size={15} />
              <span>{WE_BUILD_AUSTRALIA_PROFILE.headOffice.phone}</span>
            </a>

            <a
              href={`mailto:${WE_BUILD_AUSTRALIA_PROFILE.headOffice.email}`}
              className="careers-address"
              title="Email info@webuildgroup.company"
            >
              <Mail size={15} />
              <span>{WE_BUILD_AUSTRALIA_PROFILE.headOffice.email} ↗</span>
            </a>
          </div>
        </div>

        {/* 2x2 Grid of Department Cards (Screenshot 1: exact layout) */}
        <div className="careers-depts">
          {deptCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={onGoToCareers}
              className="dept-card group"
            >
              <div className="dept-image">
                <img src={card.image} alt={card.title} loading="lazy" />
                <span className="dept-tag">{card.tag}</span>
              </div>
              <div className="dept-body">
                <h3>{card.title}</h3>
                <span className="dept-arrow" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
