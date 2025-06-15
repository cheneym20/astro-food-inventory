import type { APIRoute } from 'astro';
import { query } from '../../lib/db';
import bcrypt from 'bcryptjs';

export const POST: APIRoute = async ({ request }) => {
  const { email, password } = await request.json();
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (rows.length > 0) {
    return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 409 });
  }
  const password_hash = await bcrypt.hash(password, 10);
  const result = await query(
    'INSERT INTO users (email, password_hash, created_at) VALUES ($1, $2, NOW()) RETURNING user_id, email',
    [email, password_hash]
  );
  return new Response(JSON.stringify(result.rows[0]), { status: 201 });
};
