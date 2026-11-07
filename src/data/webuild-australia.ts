export interface JobOpening {
  id: string;
  title: string;
  division: 'Heritage Restoration' | 'Social Housing' | 'Civil & Stormwater' | 'Childcare & Community' | 'Residential' | 'Commercial & WHS';
  location: string;
  type: 'Full-time' | 'Contract' | 'Apprenticeship';
  salaryRange: string;
  experience: string;
  summary: string;
  requirements: string[];
  responsibilities: string[];
  featured?: boolean;
}

export interface ConstructionProject {
  id: string;
  title: string;
  category: 'Heritage Restoration' | 'Social & Public Housing' | 'Civil & Stormwater' | 'Childcare & Community' | 'Residential Building';
  client: string;
  location: string;
  yearCompleted: string;
  description: string;
  highlights: string[];
  awardOrBadge?: string;
  image: string;
}

export const WE_BUILD_AUSTRALIA_PROFILE = {
  legalName: 'We Build Australia Pty Ltd',
  tradingName: 'We Build Australia',
  founded: '2014',
  hqLocation: 'Sydney, New South Wales',
  licenceNumber: 'NSW Fair Trading Builder Licence #274910C',
  abn: '89 168 514 829',
  masterBuildersMember: 'Master Builders Association NSW #502194',
  
  headOffice: {
    address: 'Level 19/99 Walker Street',
    suburb: 'North Sydney',
    state: 'NSW',
    postcode: '2060',
    phone: '+61 420 127 424',
    directLine: '+61 420 127 424',
    phoneRaw: '61420127424',
    email: 'info@webuildgroup.company',
    careersEmail: 'info@webuildgroup.company',
    tendersEmail: 'info@webuildgroup.company',
  },

  missionAndPurpose: {
    publicSectorFocus:
      'Built to deliver high-quality infrastructure and building works for the public sector, government agencies, local councils, and housing bodies (such as the NSW Land and Housing Corporation - LAHC).',
    communityHeritageValue:
      'Focused on preserving heritage assets, improving social housing, and supporting local neighborhoods with a hands-on senior leadership team managing projects from conception to handover.',
  },

  coreServices: [
    {
      id: 'heritage',
      title: 'Heritage Restoration',
      tagline: 'Preserving NSW\'s architectural history with artisanal precision',
      description:
        'Restoring and conserving historical and heritage-listed buildings across Sydney and regional NSW. Our dedicated stonemasonry, joinery, and lime-mortar conservation methods have earned distinguished recognition including the National Trust Heritage Award.',
      deliverables: [
        'Sandstone conservation, repointing, and structural seismic reinforcement',
        'Traditional timber joinery, slate roofing, and leadwork remediation',
        'Adaptive reuse of colonial, Victorian, and mid-century civic structures',
        'National Trust Heritage Award recognized project methodologies',
      ],
      icon: 'Landmark',
      badge: 'National Trust Heritage Award Winner',
    },
    {
      id: 'social-housing',
      title: 'Social & Public Housing Remediation',
      tagline: 'Upgrading occupied homes with respect, dignity, and efficiency',
      description:
        'Upgrading, remediating, and modernizing occupied public and social housing units for government bodies including the NSW Land and Housing Corporation (LAHC). We specialize in tenant-in-place works with comprehensive tenant liaison and safety protocols.',
      deliverables: [
        'Kitchen, bathroom, and wet-area complete modernizations in occupied units',
        'Structural concrete cancer repair, waterproofing, and facade remediation',
        'NDIS and accessibility retrofits (wheelchair ramps, handrails, wider doors)',
        'Thermal insulation, window upgrades, and energy-efficiency compliance',
      ],
      icon: 'Home',
      badge: 'NSW LAHC Approved Panel Builder',
    },
    {
      id: 'civil-stormwater',
      title: 'Civil Infrastructure & Stormwater Works',
      tagline: 'Robust engineering for flood zones, drainage, and public realms',
      description:
        'Executing civil works, stormwater management, and sewer/flood-zone remediation for local councils and urban development authorities. From major culverts to subsurface detention systems, we protect communities against climate resilience challenges.',
      deliverables: [
        'Gross pollutant traps (GPT), on-site stormwater detention (OSD) systems',
        'Sewer main diversions, encasements, and Sydney Water coordination',
        'Flood-zone embankment stabilization and creek-line environmental rehabilitation',
        'Urban streetscapes, pedestrian plazas, and shared pathway civil works',
      ],
      icon: 'Pickaxe',
      badge: 'Civil & Stormwater Certified',
    },
    {
      id: 'childcare-community',
      title: 'Childcare & Community Facilities',
      tagline: 'Creating safe, vibrant, and enduring spaces for NSW families',
      description:
        'Building purpose-built childcare centers, early learning academies, council libraries, and public-use community infrastructure designed to foster collaboration and child development in line with National Quality Standards (NQS).',
      deliverables: [
        'Purpose-built 60 to 120-place early education and care centers',
        'Acoustically engineered play spaces, sun-safe canopies, and nature playgrounds',
        'Community halls, youth hubs, and sporting amenities for local councils',
        'Strict regulatory compliance with the Children (Education and Care Services) National Law',
      ],
      icon: 'Baby',
      badge: 'BCA & NQS Compliant',
    },
    {
      id: 'residential',
      title: 'Residential Building',
      tagline: 'Architectural craftsmanship for contemporary Australian living',
      description:
        'Constructing custom architect-designed homes, luxury duplexes, multi-unit townhouses, and quality secondary dwellings (granny flats). We deliver exceptional finishes, structural durability, and seamless council approvals.',
      deliverables: [
        'Custom architectural family residences and luxury contemporary homes',
        'Side-by-side duplexes and dual-occupancy turn-key developments',
        'Boutique townhouse master developments across Sydney metropolitan zones',
        'High-yielding granny flats and multi-generational secondary dwellings',
      ],
      icon: 'Building',
      badge: 'NSW Master Builder Builder Quality',
    },
  ],

  projects: [
    {
      id: 'millers-point-heritage',
      title: 'Millers Point Historic Maritime Residence Restoration',
      category: 'Heritage Restoration',
      client: 'NSW Heritage & Private Conserving Trust',
      location: 'Millers Point, Sydney NSW',
      yearCompleted: '2024',
      description:
        'Comprehensive conservation of 1880s heritage-listed Victorian stone terraces overlooking Sydney Harbour. Intricate sandstone restoration, cedar woodwork replication, and delicate structural stabilization.',
      highlights: ['Sydney Sandstone conservation', 'Lime mortar historic repointing', 'National Trust Heritage Award commended'],
      awardOrBadge: 'National Trust Heritage Award Winner',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'lahc-western-sydney',
      title: 'Western Sydney Social Housing Modernization Program',
      category: 'Social & Public Housing',
      client: 'NSW Land and Housing Corporation (LAHC)',
      location: 'Blacktown & Mount Druitt, NSW',
      yearCompleted: '2025',
      description:
        'Remediation and full internal modernization across 140 occupied public housing homes. Works delivered under strict tenant-liaison management with zero displacement, installing new kitchens, accessibility bathrooms, and energy-efficient lighting.',
      highlights: ['140 Homes remediated', '100% On-time delivery', 'Specialist NDIS accessibility modifications'],
      awardOrBadge: 'Public Housing Excellence Recognition',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'parramatta-stormwater',
      title: 'Parramatta River Basin Stormwater & Culvert Remediation',
      category: 'Civil & Stormwater',
      client: 'City of Parramatta Council',
      location: 'Parramatta, NSW',
      yearCompleted: '2024',
      description:
        'Engineering and construction of 1,200m of high-capacity precast box culverts, subsurface detention tanks, and bio-retention swales to mitigate 1-in-100-year flood risk for community assets.',
      highlights: ['1,200m Culverts installed', 'Gross Pollutant Trap integration', 'Riparian corridor restoration'],
      awardOrBadge: 'Civic Infrastructure Quality Award',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ryde-early-learning',
      title: 'Ryde Community Civic Hub & 90-Place Childcare Facility',
      category: 'Childcare & Community',
      client: 'City of Ryde & Early Education Partner',
      location: 'Ryde, Sydney NSW',
      yearCompleted: '2025',
      description:
        'State-of-the-art dual-purpose early childhood learning center and adjoining multi-purpose community hall, featuring natural timber structures, acoustic insulation, and sustainable solar photovoltaic roof array.',
      highlights: ['90 Childcare places', 'Multi-purpose 180-person community hall', '5-Star Green Star standard'],
      awardOrBadge: 'BCA & NQS Exemplary Standard',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'inner-west-townhouses',
      title: 'The Cooperage: Boutique Architectural Townhouses',
      category: 'Residential Building',
      client: 'Private Joint Venture',
      location: 'Marrickville, Sydney NSW',
      yearCompleted: '2025',
      description:
        'Construction of 8 bespoke, multi-level architectural townhouses blending industrial brickwork with refined modern interiors, private landscaped courtyards, and integrated basements.',
      highlights: ['8 Luxury townhouses', 'Recycled heritage brick facade', 'Turnkey handover in 14 months'],
      awardOrBadge: 'NSW Master Builders Finalist',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
  ] as ConstructionProject[],

  jobOpenings: [
    {
      id: 'wba-job-01',
      title: 'Site Manager – Heritage Restoration',
      division: 'Heritage Restoration',
      location: 'Sydney CBD & Eastern Suburbs, NSW',
      type: 'Full-time',
      salaryRange: '$135,000 - $160,000 + Super + Vehicle',
      experience: '5+ years in Australian heritage or commercial building',
      summary:
        'Lead high-profile restoration and conservation projects across Sydney heritage assets. Oversee specialized stonemasons, carpenters, and subcontractors while upholding strict heritage architect specifications.',
      requirements: [
        'NSW Fair Trading Supervisor Certificate or Builder Licence',
        'Proven track record on NSW heritage-listed or conservation projects',
        'Current SafeWork NSW General Construction Induction (White Card)',
        'Strong knowledge of lime mortars, traditional joinery, and structural remediation',
        'Demonstrated leadership in site safety (WHS) and subcontractor coordination',
      ],
      responsibilities: [
        'Direct all day-to-day site operations, staging, and quality control',
        'Liaise with heritage consultants, council inspectors, and client representatives',
        'Maintain daily site logs, program tracking, and lookahead schedules',
        'Enforce Zero-Harm safety standards and SafeWork NSW compliance',
      ],
      featured: true,
    },
    {
      id: 'wba-job-02',
      title: 'Project Manager – Social Housing Remediation',
      division: 'Social Housing',
      location: 'Sydney Metro & North Sydney HQ, NSW',
      type: 'Full-time',
      salaryRange: '$140,000 - $165,000 + Super + Tool of Trade',
      experience: '4+ years managing multi-unit remediation programs',
      summary:
        'Drive multi-site refurbishment and remediation programs for the NSW Land and Housing Corporation (LAHC). Manage budgets, procurement, and compassionate tenant-in-place works.',
      requirements: [
        'Tertiary qualification in Construction Management, Building, or Engineering',
        'Experience with NSW Government or public housing sector contracts',
        'Exceptional tenant-liaison diplomacy and communication skills',
        'Current Australian Driver Licence and SafeWork White Card',
        'Proficiency in Procore, MS Project, and cost management software',
      ],
      responsibilities: [
        'Manage package budgets ($3M to $12M) from scope validation to practical completion',
        'Lead tenant notices, access coordination, and community stakeholder updates',
        'Oversee procurement of trade packages, defects minimization, and milestone handovers',
        'Report directly to the Senior Leadership team on program and margin',
      ],
      featured: true,
    },
    {
      id: 'wba-job-03',
      title: 'Civil & Stormwater Site Superintendent',
      division: 'Civil & Stormwater',
      location: 'Greater Sydney & Western Sydney, NSW',
      type: 'Full-time',
      salaryRange: '$130,000 - $155,000 + Super + Ute',
      experience: '5+ years supervising civil drainage and earthworks',
      summary:
        'Supervise civil infrastructure, stormwater drainage networks, box culvert installations, and sewer diversions across municipal and government land developments.',
      requirements: [
        'Extensive experience with Sydney Water asset protection and council drainage standards',
        'Tickets for excavator/plant operations (preferred) and White Card',
        'Deep knowledge of trench shoring, dewatering, and flood-zone erosion controls',
        'Proven ability to read civil drawings, invert levels, and set out works',
      ],
      responsibilities: [
        'Coordinate machine operators, pipelayers, and concreting crews',
        'Supervise deep excavation safety, service locating, and traffic management',
        'Liaise with civil design engineers and council inspectors for hold-point inspections',
        'Ensure environmental compliance (sediment basins, turbidity control)',
      ],
      featured: true,
    },
    {
      id: 'wba-job-04',
      title: 'Site Supervisor – Residential & Townhouses',
      division: 'Residential',
      location: 'Inner West & South West Sydney, NSW',
      type: 'Full-time',
      salaryRange: '$115,000 - $135,000 + Super + Vehicle allowance',
      experience: '3+ years supervising multi-dwelling residential construction',
      summary:
        'Supervise high-quality townhouse and custom duplex residential builds from ground slab through to detailed architectural finishes.',
      requirements: [
        'Trade background (Carpentry or Licensed Builder preferred)',
        'Thorough understanding of the National Construction Code (NCC) and Australian Standards',
        'Strong eye for architectural detailing, waterproofing, and defect-free finishes',
        'White Card and current NSW Driver Licence',
      ],
      responsibilities: [
        'Supervise trades (framers, plasterers, tilers, joiners, painters)',
        'Conduct daily quality checks and enforce strict timeline targets',
        'Organize building certifier milestone inspections (slab, frame, wet areas, final)',
        'Maintain professional relationship with private clients and architects',
      ],
      featured: false,
    },
    {
      id: 'wba-job-05',
      title: 'Childcare & Community Facilities Lead Estimator',
      division: 'Childcare & Community',
      location: 'North Sydney HQ (Hybrid available), NSW',
      type: 'Full-time',
      salaryRange: '$120,000 - $145,000 + Super',
      experience: '3+ years commercial estimating / quantity surveying',
      summary:
        'Price, measure, and assemble competitive tenders for early learning centers, council civic facilities, and public sector tenders.',
      requirements: [
        'Degree/Diploma in Quantity Surveying, Construction Economics, or equivalent',
        'Experience measuring from BIM/CAD models using Buildsoft / CostX',
        'Solid network of NSW subcontractors and suppliers',
        'Analytical mind with keen attention to contractual conditions',
      ],
      responsibilities: [
        'Prepare detailed trade breakups, Bill of Quantities (BOQ), and cost plans',
        'Issue tender packages to subcontractors and conduct rigorous quote comparisons',
        'Identify value-engineering alternatives and risk mitigations for government clients',
        'Collaborate with Senior Leadership during final bid adjudication',
      ],
      featured: false,
    },
    {
      id: 'wba-job-06',
      title: 'Apprentice Carpenter / Trade Trainee',
      division: 'Residential',
      location: 'Sydney Metropolitan, NSW',
      type: 'Apprenticeship',
      salaryRange: 'Award Wages (1st to 4th Year) + Super + Tool Support',
      experience: 'Motivated school leaver or junior trade background',
      summary:
        'Kickstart your construction career with We Build Australia. Learn from master carpenters and licensed builders across heritage restorations and architectural home building.',
      requirements: [
        'Current SafeWork NSW White Card (or willingness to obtain before starting)',
        'Reliable transport and current Driver Licence (P-plates accepted)',
        'Strong work ethic, punctuality, and pride in physical craft',
        'Enrolled in or eligible for Certificate III in Carpentry (TAFE NSW)',
      ],
      responsibilities: [
        'Assist with wall framing, roof trusses, eaves, and cladding installation',
        'Learn precision second-fix joinery, architraves, skirting, and door hanging',
        'Support site setup, material handling, and clean work practices',
        'Attend TAFE NSW trade classes and complete competency logbooks',
      ],
      featured: true,
    },
    {
      id: 'wba-job-07',
      title: 'Work Health, Safety & Environment (WHS) Site Officer',
      division: 'Commercial & WHS',
      location: 'Sydney & Regional NSW Projects',
      type: 'Full-time',
      salaryRange: '$110,000 - $130,000 + Super + Car',
      experience: '3+ years dedicated WHS on construction sites',
      summary:
        'Champion our proactive safety culture across active civil, social housing, and commercial building sites. Ensure 100% compliance with SafeWork NSW legislation.',
      requirements: [
        'Certificate IV or Diploma in Work Health and Safety (WHS)',
        'Solid understanding of SafeWork NSW legislation, codes of practice, and hazardous materials (asbestos awareness)',
        'Strong interpersonal skills to mentor trades and workers on safety',
        'Current White Card and valid Driver Licence',
      ],
      responsibilities: [
        'Conduct daily and weekly site safety inspections and risk assessments (SWMS audits)',
        'Lead site inductions, toolbox talks, and incident management investigations',
        'Maintain digital safety registers and environmental compliance records',
        'Prepare WHS monthly reporting for client agencies and council bodies',
      ],
      featured: false,
    },
  ] as JobOpening[],
};
