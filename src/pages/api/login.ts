import type { APIRoute } from 'astro';
import { query } from '../../lib/db';
import bcrypt from 'bcryptjs';

export const POST: APIRoute = async ({ request }) => {
  const { email, password } = await request.json();
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
  }
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
  }
  // For demo: return user info (in production, use JWT or session)
  return new Response(JSON.stringify({ user_id: user.user_id, email: user.email }), { status: 200 });
};
