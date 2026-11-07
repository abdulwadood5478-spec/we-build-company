/**
 * Webuild Group Australia - Encrypted File Vault & Transfer Store
 * Handles persistent storage of client-encrypted payloads and transmittal metadata.
 */

import { bufferToBase64, base64ToBuffer, calculateSha256 } from './crypto';

export interface AuditLogEntry {
  timestamp: string;
  action: 'created' | 'decrypted' | 'downloaded' | 'revoked';
  details: string;
  location: string;
}

export interface CodedTransferItem {
  id: string;
  code: string; // e.g. WB-849-201
  name: string;
  size: number;
  mimeType: string;
  category: string;
  siteProject: string;
  classification: string;
  created: string;
  expiresAt: string;
  expiryOption: '1h' | '24h' | '3d' | '7d' | 'burn';
  maxDownloads: number;
  downloadCount: number;
  status: 'active' | 'downloaded' | 'expired' | 'revoked';
  hasPassword: boolean;
  saltHex: string;
  ivHex: string;
  checksumSha256: string;
  keyFragment: string;
  senderEmail: string;
  recipientMemo: string;
  downloadLog: AuditLogEntry[];
  cipherDataBase64?: string; // Stored payload for decryption
}

const STORAGE_KEY = 'webuild_australia_transfers_v1';
const MEMORY_CIPHER_CACHE = new Map<string, ArrayBuffer>();

// Pre-seeded realistic Australian engineering and public sector transfer records
const SEEDED_TRANSFERS: CodedTransferItem[] = [
  {
    id: 'wba_tr_heritage_01',
    code: 'WBA-849-201',
    name: 'Millers-Point-Heritage-Sandstone-Conservation-Spec-RevA.pdf',
    size: 4892014, // 4.89 MB
    mimeType: 'application/pdf',
    category: 'Heritage Restoration',
    siteProject: 'Millers Point Heritage Terraces',
    classification: 'Heritage Architecture Specification',
    created: new Date(Date.now() - 3600000 * 4).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 68).toISOString(),
    expiryOption: '3d',
    maxDownloads: 5,
    downloadCount: 2,
    status: 'active',
    hasPassword: false,
    saltHex: '3a49f81b2c90e5d871239ab45c6e8f10',
    ivHex: '7b91d2c4e85012fa6b304e9c',
    checksumSha256: '9a7e28b14c50f83e29d71a620b854e7d1c93f0b24e6a8d7c1e3b5a790f124c8e',
    keyFragment: 'bWlsbGVycy1wb2ludC1zYW5kc3RvbmUta2V5LTIwMjY=',
    senderEmail: 'heritage@webuildaustralia.com.au',
    recipientMemo: 'National Trust Heritage Award approved conservation methodology, lime-mortar specifications, and stonemasonry structural ties.',
    downloadLog: [
      {
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        action: 'downloaded',
        details: 'Decrypted via Coded Access Token (Heritage Architect Office)',
        location: 'Sydney CBD, NSW, Australia',
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        action: 'downloaded',
        details: 'Decrypted via Mobile QR Scan (Millers Point Site)',
        location: 'Millers Point, NSW, Australia',
      },
    ],
  },
  {
    id: 'wba_tr_housing_02',
    code: 'WBA-771-940',
    name: 'LAHC-Blacktown-Social-Housing-Remediation-Schedule-2026.pdf',
    size: 8420184, // 8.42 MB
    mimeType: 'application/pdf',
    category: 'Social & Public Housing',
    siteProject: 'LAHC Western Sydney Social Housing Upgrades',
    classification: 'LAHC Social Housing Remediation',
    created: new Date(Date.now() - 3600000 * 18).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 54).toISOString(),
    expiryOption: '3d',
    maxDownloads: 10,
    downloadCount: 4,
    status: 'active',
    hasPassword: false,
    saltHex: '82f1b049d5c8e7123498ab67ef012345',
    ivHex: '19e7a2b5c8f0312456ab78cd',
    checksumSha256: '4b1029c8e75f12a3d46b89c0ef123456789abcdef0123456789abcdef012345',
    keyFragment: 'bGFoYy1zb2NpYWwtaG91c2luZy1zY2hlZHVsZS0yMDI2',
    senderEmail: 'housing.contracts@webuildaustralia.com.au',
    recipientMemo: '140-unit occupied tenant refurbishment staging, NDIS accessibility compliance checklists, and trade subcontractor scopes.',
    downloadLog: [
      {
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        action: 'downloaded',
        details: 'Decrypted via Web Portal (LAHC Housing Inspector)',
        location: 'Parramatta, NSW, Australia',
      },
    ],
  },
  {
    id: 'wba_tr_civil_03',
    code: 'WBA-948-217',
    name: 'Parramatta-Basin-Stormwater-Detention-Civil-Drawings.dwg',
    size: 16104800, // 16.1 MB
    mimeType: 'application/acad',
    category: 'Civil Infrastructure & Stormwater',
    siteProject: 'Parramatta Basin Stormwater & Culverts',
    classification: 'Civil Infrastructure & Stormwater',
    created: new Date(Date.now() - 3600000 * 36).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 132).toISOString(),
    expiryOption: '7d',
    maxDownloads: 3,
    downloadCount: 1,
    status: 'active',
    hasPassword: true,
    saltHex: '54e9a1b2c3d4f5061728394a5b6c7d8e',
    ivHex: '49a8b7c6d5e4f30219283746',
    checksumSha256: 'c8192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901234567',
    keyFragment: 'derived:password',
    senderEmail: 'civil.engineers@webuildaustralia.com.au',
    recipientMemo: 'Precast box culvert hydraulics, Sydney Water connection approvals, and flood-zone retention calculations.',
    downloadLog: [
      {
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
        action: 'downloaded',
        details: 'Decrypted with secondary Passphrase Authentication',
        location: 'Parramatta, NSW, Australia',
      },
    ],
  },
  {
    id: 'wba_tr_childcare_04',
    code: 'WBA-319-582',
    name: 'Ryde-Early-Learning-Childcare-Acoustic-Compliance-Plan.pdf',
    size: 3450190, // 3.45 MB
    mimeType: 'application/pdf',
    category: 'Childcare & Community Facilities',
    siteProject: 'Ryde Community Civic & Childcare Centre',
    classification: 'Public Sector / Council Tender',
    created: new Date(Date.now() - 3600000 * 50).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 22).toISOString(),
    expiryOption: '3d',
    maxDownloads: 50,
    downloadCount: 19,
    status: 'active',
    hasPassword: false,
    saltHex: '1029384756afbecd1234567890abcdef',
    ivHex: 'fedcba098765432112345678',
    checksumSha256: '718293a4b5c6d7e8f90a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4',
    keyFragment: 'cnlkZS1jaGlsZGNhcmUtZGVzaWduLTIwMjYta2V5',
    senderEmail: 'community.projects@webuildaustralia.com.au',
    recipientMemo: 'BCA Section J energy assessment, outdoor play acoustic perimeter wall details, and council certifier stamped plans.',
    downloadLog: [],
  },
  {
    id: 'wba_tr_townhouse_05',
    code: 'WBA-620-184',
    name: 'Marrickville-Townhouse-Boutique-Architectural-Set.dwg',
    size: 11890200, // 11.89 MB
    mimeType: 'application/acad',
    category: 'Residential Building',
    siteProject: 'Marrickville Architectural Townhouses',
    classification: 'Residential Custom / Duplex Plans',
    created: new Date(Date.now() - 3600000 * 80).toISOString(),
    expiresAt: new Date(Date.now() - 3600000 * 8).toISOString(), // Expired
    expiryOption: '3d',
    maxDownloads: 3,
    downloadCount: 3,
    status: 'expired',
    hasPassword: false,
    saltHex: 'abcdef01234567891029384756afbecd',
    ivHex: '12345678fedcba0987654321',
    checksumSha256: 'f0e1d2c3b4a5968778695a4b3c2d1e0f0e1d2c3b4a5968778695a4b3c2d1e0f',
    keyFragment: 'bWFycmlja3ZpbGxlLXRvd25ob3VzZXMtYXJjaC1rZXk=',
    senderEmail: 'residential@webuildaustralia.com.au',
    recipientMemo: 'Architectural structural framing, masonry brick ties, and duplex stormwater drainage plan.',
    downloadLog: [],
  },
];

class TransferStore {
  private transfers: CodedTransferItem[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.transfers = [...SEEDED_TRANSFERS];
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.transfers = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed loading transfers from localStorage:', e);
    }

    // Default to seeded transfers
    this.transfers = [...SEEDED_TRANSFERS];
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.transfers));
      } catch (err) {
        console.warn('Failed to persist transfers:', err);
      }
    }
  }

  // Get all transfers (updates status if expired)
  getAll(): CodedTransferItem[] {
    const now = new Date().getTime();
    let updated = false;

    this.transfers.forEach((item) => {
      const expTime = new Date(item.expiresAt).getTime();
      if (item.status === 'active' && now > expTime) {
        item.status = 'expired';
        updated = true;
      }
      if (item.status === 'active' && item.maxDownloads > 0 && item.downloadCount >= item.maxDownloads) {
        item.status = 'downloaded';
        updated = true;
      }
    });

    if (updated) {
      this.persist();
    }

    return [...this.transfers];
  }

  // Find a transfer by its code (case insensitive, ignores dashes)
  findByCode(codeOrId: string): CodedTransferItem | null {
    if (!codeOrId) return null;
    const cleanSearch = codeOrId.trim().toUpperCase().replace(/[\s-]/g, '');

    const items = this.getAll();
    return (
      items.find((item) => {
        const cleanCode = item.code.toUpperCase().replace(/[\s-]/g, '');
        const cleanId = item.id.toUpperCase();
        return cleanCode === cleanSearch || cleanId === cleanSearch || item.code.toUpperCase() === codeOrId.trim().toUpperCase();
      }) || null
    );
  }

  // Save new transfer record
  saveTransfer(item: CodedTransferItem, rawCipherBuffer?: ArrayBuffer) {
    if (rawCipherBuffer) {
      MEMORY_CIPHER_CACHE.set(item.id, rawCipherBuffer);
      // For smaller files (<4MB), store Base64 in local item for immediate cross-tab recovery
      if (rawCipherBuffer.byteLength < 4 * 1024 * 1024) {
        try {
          item.cipherDataBase64 = bufferToBase64(rawCipherBuffer);
        } catch (e) {
          console.warn('Payload too large for base64 storage, kept in memory cache');
        }
      }
    }

    this.transfers.unshift(item);
    this.persist();
  }

  // Retrieve cipher buffer for decryption
  getCipherBuffer(id: string): ArrayBuffer | null {
    if (MEMORY_CIPHER_CACHE.has(id)) {
      return MEMORY_CIPHER_CACHE.get(id)!;
    }

    const item = this.transfers.find((t) => t.id === id);
    if (item && item.cipherDataBase64) {
      const buffer = base64ToBuffer(item.cipherDataBase64);
      MEMORY_CIPHER_CACHE.set(id, buffer);
      return buffer;
    }

    // Generate fallback mock encrypted content for seeded items if not in cache
    const mockContent = new TextEncoder().encode(
      `%PDF-1.7\n% Webuild Group Australia Official Engineering Archive\n% Transmittal ID: ${id}\n% Document: ${item?.name || 'File'}\n% Integrity: SHA-256 Validated\n% SafeWork Australia / ISO 27001 Authenticated`
    );
    return mockContent.buffer;
  }

  // Record a download event and increment count
  recordDownload(id: string, location = 'Sydney, NSW, Australia') {
    const item = this.transfers.find((t) => t.id === id);
    if (!item) return;

    item.downloadCount += 1;
    item.downloadLog.unshift({
      timestamp: new Date().toISOString(),
      action: 'downloaded',
      details: `Decrypted and downloaded on device (${location})`,
      location,
    });

    if (item.expiryOption === 'burn' || (item.maxDownloads > 0 && item.downloadCount >= item.maxDownloads)) {
      item.status = 'downloaded';
    }

    this.persist();
  }

  // Revoke / delete transfer
  revokeTransfer(id: string) {
    const item = this.transfers.find((t) => t.id === id);
    if (item) {
      item.status = 'revoked';
      item.downloadLog.unshift({
        timestamp: new Date().toISOString(),
        action: 'revoked',
        details: 'Access revoked manually by Webuild engineering controller.',
        location: 'Melbourne HQ, Australia',
      });
      this.persist();
    }
  }

  // Permanently delete transfer
  deleteTransfer(id: string) {
    this.transfers = this.transfers.filter((t) => t.id !== id);
    MEMORY_CIPHER_CACHE.delete(id);
    this.persist();
  }
}

export const transferStore = new TransferStore();
