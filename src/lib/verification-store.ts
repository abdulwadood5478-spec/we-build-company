/**
 * We Build Australia - Verification Submissions & Document Audit Store
 * Stores offer letters and employment credentials submitted for verification.
 * Gathered into the password-protected Admin Portal.
 */

export interface VerificationSubmission {
  id: string;
  refCode: string; // e.g. WBA-VER-2026-948102
  candidateName: string;
  email: string; // Where candidate receives reply from company
  phone?: string;
  position?: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string; // e.g. application/pdf, image/png
  fileDataUrl?: string; // Base64 data URL for preview/download
  agencyOrConsultant?: string;
  notes?: string;
  submittedAt: string;
  status: 'pending_review' | 'verified' | 'flagged';
  reviewedAt?: string;
  reviewedBy?: string;
  adminReplyNotes?: string;
}

const STORAGE_KEY = 'we_build_australia_verification_submissions_v2';
const API_PATH = '/api/verifications';

async function requestApi<T>(input: RequestInfo, init?: RequestInit): Promise<T | null> {
  if (typeof window === 'undefined') return null;
  try {
    const response = await fetch(input, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

// Seed realistic submissions for testing in the Admin Portal
const SEEDED_SUBMISSIONS: VerificationSubmission[] = [
  {
    id: 'ver_sub_01',
    refCode: 'WBA-VER-2026-948201',
    candidateName: 'Marcus Vance',
    email: 'm.vance.construction@outlook.com',
    phone: '0418 293 841',
    position: 'Senior Site Manager – Heritage Restoration',
    fileName: 'We_Build_Australia_Senior_Site_Manager_Offer.pdf',
    fileSize: 1845120, // 1.84 MB
    fileType: 'application/pdf',
    agencyOrConsultant: 'Hays Recruitment Sydney',
    notes: 'Please verify the authenticity of the sandstone conservation offer letter received yesterday.',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'verified',
    reviewedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    reviewedBy: 'Senior HR Directorate',
    adminReplyNotes: 'Authenticity confirmed against NSW Operations Directorate records. Verified for Millers Point Heritage Project.',
  },
  {
    id: 'ver_sub_02',
    refCode: 'WBA-VER-2026-582910',
    candidateName: 'Elena Rostova',
    email: 'elena.rostova.civil@gmail.com',
    phone: '0421 958 114',
    position: 'Project Engineer – Civil & Stormwater',
    fileName: 'WBA_Civil_Stormwater_Engineer_Letter.pdf',
    fileSize: 2410880, // 2.41 MB
    fileType: 'application/pdf',
    agencyOrConsultant: 'Kelly Services Australia',
    notes: 'Awaiting confirmation before resigning from previous contractor position.',
    submittedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    status: 'pending_review',
  },
  {
    id: 'ver_sub_03',
    refCode: 'WBA-VER-2026-710294',
    candidateName: 'Jarrah Williams',
    email: 'j.williams.trade@bigpond.com',
    phone: '0402 819 332',
    position: 'Licensed Builder – Social Housing Remediation',
    fileName: 'Subcontractor_Engagement_Letter_Scaffold.pdf',
    fileSize: 954000, // 954 KB
    fileType: 'application/pdf',
    agencyOrConsultant: 'Direct Senior Leadership Inquiry',
    notes: 'Offer received via email claiming to be from We Build Australia North Sydney Office.',
    submittedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: 'pending_review',
  },
];

class VerificationStore {
  private items: VerificationSubmission[] = [];

  constructor() {
    this.loadFromStorage();
    void this.refreshFromServer();
  }

  async refreshFromServer(): Promise<VerificationSubmission[]> {
    const remote = await requestApi<VerificationSubmission[]>(API_PATH);
    if (remote) {
      this.items = remote;
      this.saveToStorage();
    }
    return this.getAll();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') {
      this.items = [...SEEDED_SUBMISSIONS];
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.items = parsed;
          return;
        }
      }
    } catch {
      // ignore
    }
    this.items = [...SEEDED_SUBMISSIONS];
    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Storage limit reached, keeping in memory', e);
    }
  }

  getAll(): VerificationSubmission[] {
    return [...this.items];
  }

  getById(id: string): VerificationSubmission | undefined {
    return this.items.find((item) => item.id === id);
  }

  getByRef(refCode: string): VerificationSubmission | undefined {
    return this.items.find((item) => item.refCode.trim().toUpperCase() === refCode.trim().toUpperCase());
  }

  add(data: Omit<VerificationSubmission, 'id' | 'submittedAt'>): VerificationSubmission {
    const newSubmission: VerificationSubmission = {
      ...data,
      id: `ver_sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: new Date().toISOString(),
    };

    this.items.unshift(newSubmission);
    this.saveToStorage();
    void requestApi<VerificationSubmission>(API_PATH, { method: 'POST', body: JSON.stringify(newSubmission) });
    return newSubmission;
  }

  updateStatus(
    id: string,
    status: VerificationSubmission['status'],
    adminReplyNotes?: string,
    reviewedBy: string = 'Senior HR Directorate'
  ): VerificationSubmission | null {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const existing = this.items[index];
    const updated: VerificationSubmission = {
      ...existing,
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy,
      adminReplyNotes: adminReplyNotes !== undefined ? adminReplyNotes : existing.adminReplyNotes,
    };

    this.items[index] = updated;
    this.saveToStorage();
    void requestApi<VerificationSubmission>(`${API_PATH}/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(updated) });
    return updated;
  }

  delete(id: string): boolean {
    const prevLen = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    if (this.items.length !== prevLen) {
      this.saveToStorage();
      void requestApi(`${API_PATH}/${encodeURIComponent(id)}`, { method: 'DELETE' });
      return true;
    }
    return false;
  }

  resetToDefault(): void {
    this.items = [...SEEDED_SUBMISSIONS];
    this.saveToStorage();
  }
}

export const verificationStore = new VerificationStore();
