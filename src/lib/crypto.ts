/**
 * Webuild Group Australia - Secure Cryptographic Engine
 * Client-Side Zero-Knowledge End-to-End Encryption (AES-256-GCM + PBKDF2 + SHA-256)
 */

export interface EncryptedPayload {
  cipherBuffer: ArrayBuffer;
  ivHex: string;
  saltHex: string;
  checksumSha256: string;
  originalName: string;
  originalSize: number;
  originalMimeType: string;
  keyFragment: string;
  algorithm: string;
}

// Convert ArrayBuffer to Hex String
export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex String to Uint8Array
export function hexToBuffer(hexString: string): Uint8Array {
  const cleanHex = hexString.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Convert ArrayBuffer to Base64
export function bufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 to ArrayBuffer
export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Calculate SHA-256 checksum of an ArrayBuffer
export async function calculateSha256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

// Generate raw 256-bit AES-GCM Key
export async function generateAesKey(): Promise<{ key: CryptoKey; rawBase64: string }> {
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return {
    key,
    rawBase64: bufferToBase64(exported),
  };
}

// Import raw Base64 into AES-GCM CryptoKey
export async function importAesKey(rawBase64: string): Promise<CryptoKey> {
  const rawBuffer = base64ToBuffer(rawBase64);
  return await window.crypto.subtle.importKey(
    'raw',
    rawBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Derive AES-GCM key from a custom password + salt using PBKDF2 (100,000 iterations)
export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a File object client-side using AES-256-GCM.
 * Optional secondary passphrase will derive key via PBKDF2 instead of pure raw random key.
 */
export async function encryptFile(
  file: File,
  extraPassword?: string
): Promise<EncryptedPayload> {
  const fileBuffer = await file.arrayBuffer();
  const checksum = await calculateSha256(fileBuffer);

  // Generate 96-bit (12-byte) IV for GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  // Generate 128-bit (16-byte) Salt
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  let cryptoKey: CryptoKey;
  let keyFragment = '';

  if (extraPassword && extraPassword.trim().length > 0) {
    cryptoKey = await deriveKeyFromPassword(extraPassword.trim(), salt);
    keyFragment = 'derived:password';
  } else {
    const generated = await generateAesKey();
    cryptoKey = generated.key;
    keyFragment = generated.rawBase64;
  }

  // Encrypt
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    cryptoKey,
    fileBuffer
  );

  return {
    cipherBuffer: encryptedBuffer,
    ivHex: bufferToHex(iv),
    saltHex: bufferToHex(salt),
    checksumSha256: checksum,
    originalName: file.name,
    originalSize: file.size,
    originalMimeType: file.type || 'application/octet-stream',
    keyFragment,
    algorithm: 'AES-256-GCM (Zero-Knowledge)',
  };
}

/**
 * Decrypt an ArrayBuffer client-side with AES-256-GCM and verify integrity checksum.
 */
export async function decryptFile(
  cipherBuffer: ArrayBuffer,
  ivHex: string,
  saltHex: string,
  keyFragment: string,
  expectedChecksum: string,
  extraPassword?: string
): Promise<{ decryptedBlob: Blob; verified: boolean; actualChecksum: string }> {
  const iv = hexToBuffer(ivHex);
  const salt = hexToBuffer(saltHex);

  let cryptoKey: CryptoKey;

  if (keyFragment === 'derived:password') {
    if (!extraPassword) {
      throw new Error('This transfer is protected with a security passphrase. Please provide the password.');
    }
    cryptoKey = await deriveKeyFromPassword(extraPassword.trim(), salt);
  } else {
    cryptoKey = await importAesKey(keyFragment);
  }

  let decryptedBuffer: ArrayBuffer;
  try {
    decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      cryptoKey,
      cipherBuffer
    );
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Decryption failed. The secret key or passphrase is incorrect, or the file payload has been corrupted.');
  }

  const actualChecksum = await calculateSha256(decryptedBuffer);
  const verified = actualChecksum.toLowerCase() === expectedChecksum.toLowerCase();

  if (!verified) {
    throw new Error('Integrity verification failed. SHA-256 checksum mismatch.');
  }

  const decryptedBlob = new Blob([decryptedBuffer]);
  return {
    decryptedBlob,
    verified,
    actualChecksum,
  };
}

// Generate an official Webuild Australia formatted Coded Transfer ID (e.g. WB-849201 or WB-9482-1736)
export function generateCodedTransferId(format: 'short' | 'standard' | 'numeric' = 'standard'): string {
  if (format === 'numeric') {
    // 10-digit numeric agency ID
    const n = Math.floor(1000000000 + Math.random() * 9000000000);
    return n.toString();
  }
  
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WB-${rand.slice(0, 3)}-${rand.slice(3, 6)}`;
}

// Format bytes into human readable string
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
