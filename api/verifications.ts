import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL });
let schemaReady: Promise<void> | null = null;

function ensureSchema() {
  schemaReady ??= pool.query(`
    CREATE TABLE IF NOT EXISTS verification_submissions (
      id TEXT PRIMARY KEY,
      ref_code TEXT NOT NULL UNIQUE,
      candidate_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      position TEXT,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_type TEXT NOT NULL,
      file_data_url TEXT,
      agency_or_consultant TEXT,
      notes TEXT,
      submitted_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL,
      reviewed_at TIMESTAMPTZ,
      reviewed_by TEXT,
      admin_reply_notes TEXT
    )
  `).then(() => undefined);
  return schemaReady;
}

const columns = `id, ref_code AS "refCode", candidate_name AS "candidateName", email, phone, position,
  file_name AS "fileName", file_size AS "fileSize", file_type AS "fileType", file_data_url AS "fileDataUrl",
  agency_or_consultant AS "agencyOrConsultant", notes, submitted_at AS "submittedAt", status,
  reviewed_at AS "reviewedAt", reviewed_by AS "reviewedBy", admin_reply_notes AS "adminReplyNotes"`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();
    const id = typeof req.query.id === 'string' ? req.query.id : undefined;

    if (req.method === 'GET') {
      const result = await pool.query(`SELECT ${columns} FROM verification_submissions ORDER BY submitted_at DESC`);
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const item = req.body;
      const result = await pool.query(
        `INSERT INTO verification_submissions
          (id, ref_code, candidate_name, email, phone, position, file_name, file_size, file_type, file_data_url, agency_or_consultant, notes, submitted_at, status, reviewed_at, reviewed_by, admin_reply_notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status, reviewed_at=EXCLUDED.reviewed_at, reviewed_by=EXCLUDED.reviewed_by, admin_reply_notes=EXCLUDED.admin_reply_notes
         RETURNING ${columns}`,
        [item.id, item.refCode, item.candidateName, item.email, item.phone ?? null, item.position ?? null, item.fileName, item.fileSize, item.fileType, item.fileDataUrl ?? null, item.agencyOrConsultant ?? null, item.notes ?? null, item.submittedAt, item.status, item.reviewedAt ?? null, item.reviewedBy ?? null, item.adminReplyNotes ?? null],
      );
      return res.status(201).json(result.rows[0]);
    }

    if (id && req.method === 'PATCH') {
      const item = req.body;
      const result = await pool.query(
        `UPDATE verification_submissions SET status=$1, reviewed_at=$2, reviewed_by=$3, admin_reply_notes=$4 WHERE id=$5 RETURNING ${columns}`,
        [item.status, item.reviewedAt ?? new Date().toISOString(), item.reviewedBy ?? 'Senior HR Directorate', item.adminReplyNotes ?? null, id],
      );
      return result.rowCount ? res.status(200).json(result.rows[0]) : res.status(404).json({ error: 'Not found' });
    }

    if (id && req.method === 'DELETE') {
      await pool.query('DELETE FROM verification_submissions WHERE id = $1', [id]);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[verifications-api]', error);
    return res.status(500).json({ error: 'Unable to access shared verification storage' });
  }
}
