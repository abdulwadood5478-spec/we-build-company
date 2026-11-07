export interface JobApplication {
  id: string;
  referenceNumber: string; // e.g. WBA-APP-2026-7841
  jobId: string;
  jobTitle: string;
  division: string;
  candidateName: string;
  email: string;
  phone: string;
  suburb: string;
  state: string;
  postcode: string;
  experienceYears: number;
  certifications: string[]; // ['White Card', 'Builder Licence', 'First Aid', etc.]
  resumeFileName: string;
  resumeFileSize?: number;
  coverNote: string;
  availableFrom: string;
  appliedAt: string;
  status: 'Received' | 'Shortlisted' | 'Interview Scheduled' | 'Verification in Progress' | 'Approved';
}

const STORAGE_KEY_APPLICATIONS = 'we_build_australia_job_applications_v1';

const SEEDED_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_seed_01',
    referenceNumber: 'WBA-APP-2026-7841',
    jobId: 'wba-job-01',
    jobTitle: 'Site Manager – Heritage Restoration',
    division: 'Heritage Restoration',
    candidateName: 'Lachlan Murray',
    email: 'lachlan.murray.build@outlook.com.au',
    phone: '0418 293 841',
    suburb: 'Balmain',
    state: 'NSW',
    postcode: '2041',
    experienceYears: 8,
    certifications: ['SafeWork NSW White Card', 'NSW Fair Trading Builder Licence', 'Heritage Conservation Micro-credential'],
    resumeFileName: 'Lachlan_Murray_CV_Senior_Heritage_Builder.pdf',
    resumeFileSize: 1840200,
    coverNote: 'Extensive background supervising sandstone remediation at The Rocks and Paddington terraces. Passionate about craftsmanship and mentoring younger apprentices.',
    availableFrom: '2 Weeks Notice',
    appliedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: 'Shortlisted',
  },
  {
    id: 'app_seed_02',
    referenceNumber: 'WBA-APP-2026-4412',
    jobId: 'wba-job-02',
    jobTitle: 'Project Manager – Social Housing Remediation',
    division: 'Social Housing',
    candidateName: 'Grace Chen',
    email: 'grace.chen.construction@gmail.com',
    phone: '0421 958 114',
    suburb: 'Parramatta',
    state: 'NSW',
    postcode: '2150',
    experienceYears: 6,
    certifications: ['SafeWork NSW White Card', 'Bachelor of Construction Management (WSU)', 'Asbestos Awareness'],
    resumeFileName: 'Grace_Chen_PM_PublicHousing_2026.pdf',
    resumeFileSize: 2150400,
    coverNote: 'Delivered multi-stage occupied asset upgrades for community housing providers in Western Sydney. Experienced with tenant liaison, Procore, and zero-defect handovers.',
    availableFrom: 'Immediate',
    appliedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    status: 'Interview Scheduled',
  },
];

class ApplicationStore {
  private applications: JobApplication[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.applications = [...SEEDED_APPLICATIONS];
      return;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.applications = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read applications from storage:', e);
    }
    this.applications = [...SEEDED_APPLICATIONS];
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(this.applications));
      } catch (e) {
        console.warn('Could not save applications to storage:', e);
      }
    }
  }

  getAll(): JobApplication[] {
    return [...this.applications];
  }

  getById(id: string): JobApplication | null {
    return this.applications.find((a) => a.id === id) || null;
  }

  getByReference(ref: string): JobApplication | null {
    const clean = ref.trim().toUpperCase();
    return this.applications.find((a) => a.referenceNumber.toUpperCase() === clean) || null;
  }

  submit(data: Omit<JobApplication, 'id' | 'referenceNumber' | 'appliedAt' | 'status'>): JobApplication {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `WBA-APP-2026-${randomDigits}`;
    const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newApp: JobApplication = {
      ...data,
      id,
      referenceNumber,
      appliedAt: new Date().toISOString(),
      status: 'Received',
    };
    this.applications.unshift(newApp);
    this.persist();
    return newApp;
  }
}

export const applicationStore = new ApplicationStore();
