export interface AustralianProject {
  id: string;
  name: string;
  code: string;
  location: string;
  state: 'NSW' | 'VIC' | 'WA' | 'QLD' | 'SA' | 'TAS' | 'NT' | 'ACT';
  category: string;
  description: string;
  securityClearanceRequired: boolean;
}

export const WEBUILD_AUSTRALIA_PROJECTS: AustralianProject[] = [
  {
    id: 'millers-point',
    name: 'Millers Point Heritage Terraces',
    code: 'WBA-HERITAGE-MP',
    location: 'Millers Point, Sydney NSW',
    state: 'NSW',
    category: 'Heritage Restoration',
    description: 'National Trust Heritage Award recognized sandstone and traditional timber joinery conservation of 1880s Victorian maritime residences.',
    securityClearanceRequired: false,
  },
  {
    id: 'lahc-social-housing',
    name: 'LAHC Western Sydney Social Housing Upgrades',
    code: 'WBA-LAHC-HOUSING',
    location: 'Blacktown & Mount Druitt, NSW',
    state: 'NSW',
    category: 'Social & Public Housing',
    description: 'Comprehensive occupied asset remediation, wet-area accessibility retrofits, and building modernization for NSW Land and Housing Corporation.',
    securityClearanceRequired: false,
  },
  {
    id: 'parramatta-stormwater',
    name: 'Parramatta Basin Stormwater & Culverts',
    code: 'WBA-CIVIL-PARRA',
    location: 'Parramatta, NSW',
    state: 'NSW',
    category: 'Civil Infrastructure & Stormwater',
    description: 'Precast box culverts, subsurface on-site stormwater detention, and creek-line flood mitigation for local council authority.',
    securityClearanceRequired: false,
  },
  {
    id: 'ryde-childcare',
    name: 'Ryde Community Civic & Childcare Centre',
    code: 'WBA-COMMUNITY-RYD',
    location: 'Ryde, Sydney NSW',
    state: 'NSW',
    category: 'Childcare & Community Facilities',
    description: 'Purpose-built 90-place early learning education facility and public multi-purpose community hall built to high acoustic and NQS standards.',
    securityClearanceRequired: false,
  },
  {
    id: 'inner-west-residential',
    name: 'Marrickville Architectural Townhouses',
    code: 'WBA-RES-TOWNHOUSE',
    location: 'Marrickville, Sydney NSW',
    state: 'NSW',
    category: 'Residential Building',
    description: 'Custom boutique multi-unit townhouses with recycled heritage masonry, basement garaging, and architect-designed finishes.',
    securityClearanceRequired: false,
  },
  {
    id: 'wba-parramatta-hq',
    name: 'We Build Australia Operations HQ',
    code: 'WBA-HQ-PARRA',
    location: 'Parramatta, Sydney NSW',
    state: 'NSW',
    category: 'Central Direction & Tenders',
    description: 'Senior leadership command, public sector tender estimation, and technical compliance center.',
    securityClearanceRequired: false,
  },
];

export const WEBUILD_COMPANY_DETAILS = {
  legalName: 'We Build Australia Pty Ltd',
  commercialName: 'We Build Australia',
  abn: '89 168 514 829',
  licenceNumber: 'NSW Fair Trading Builder Licence #274910C',
  founded: '2014 in New South Wales',
  
  headquarters: {
    melbourne: {
      title: 'Sydney / North Sydney Head Office',
      address: 'Level 19/99 Walker Street',
      city: 'North Sydney',
      state: 'NSW',
      postcode: '2060',
      phone: '+61 420 127 424',
    },
    sydney: {
      title: 'Sydney Operations Office',
      address: 'Level 19/99 Walker Street',
      city: 'North Sydney',
      state: 'NSW',
      postcode: '2060',
      phone: '+61 420 127 424',
    },
    snowy: {
      title: 'Regional NSW Projects Hub',
      address: 'Regional Site Operations',
      city: 'Sydney Metro & Regional NSW',
      state: 'NSW',
      postcode: '2000',
      phone: '+61 420 127 424',
    },
    perth: {
      title: 'Tender & Estimating Division',
      address: 'Level 19/99 Walker Street',
      city: 'North Sydney',
      state: 'NSW',
      postcode: '2060',
      phone: '+61 420 127 424',
    },
  },

  supportEmail: 'info@webuildgroup.company',
  securityOfficerEmail: 'info@webuildgroup.company',
  officialPortalDomain: 'webuildgroup.company',

  standards: [
    'National Trust Heritage Award Recipient',
    'NSW Land and Housing Corporation (LAHC) Panel Builder',
    'Master Builders Association NSW Member #502194',
    'SafeWork NSW Work Health and Safety Compliance',
    'ISO/IEC 27001 Cryptographic Information Security',
  ],

  classifications: [
    { label: 'Public Sector / Council Tender', value: 'public-sector', color: 'amber' },
    { label: 'Heritage Architecture Specification', value: 'heritage', color: 'slate' },
    { label: 'LAHC Social Housing Remediation', value: 'housing', color: 'blue' },
    { label: 'Civil Infrastructure & Stormwater', value: 'civil', color: 'emerald' },
    { label: 'Residential Custom / Duplex Plans', value: 'residential', color: 'red' },
  ],
};
