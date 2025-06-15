import type { APIRoute } from 'astro';
import { query } from '../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let order;
  try {
    order = (await request.json()).order;
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
  if (!order || !Array.isArray(order)) {
    return new Response(JSON.stringify({ error: 'Missing or invalid order' }), { status: 400 });
  }
  const user_id = 1; // TODO: Replace with real user ID from session/auth
  await query(
    `INSERT INTO user_section_order (user_id, section_order)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET section_order = $2`,
    [user_id, JSON.stringify(order)]
  );
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
