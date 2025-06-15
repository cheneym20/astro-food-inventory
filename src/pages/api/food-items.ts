import type { APIRoute } from 'astro';
import { query } from '../../lib/db';
import type { FoodItem } from '../../lib/types';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') || 'name';
  const dir = url.searchParams.get('dir') === 'desc' ? 'DESC' : 'ASC';
  // Only allow sorting by known columns
  const allowed = ['name', 'quantity', 'location', 'expiration_date'];
  const sortKey = allowed.includes(sort) ? sort : 'name';
  const { rows } = await query(`SELECT * FROM food_items ORDER BY ${sortKey} ${dir}`);
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  let data;
  const contentType = request.headers.get('content-type') || '';
  if (
    !contentType ||
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData();
    data = Object.fromEntries(formData.entries());
  } else if (contentType.includes('application/json')) {
    data = await request.json();
  } else {
    return new Response(JSON.stringify({ error: 'Unsupported Content-Type', debug: contentType }), { status: 415 });
  }

  // Handle delete
  if (data.delete_id) {
    const result = await query('DELETE FROM food_items WHERE item_id = $1 RETURNING *', [data.delete_id]);
    if (result.rows.length > 0) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
    }
  }

  // Handle add
  const { name, quantity, location, expiration_date, user_id } = data;
  if (!name || !quantity || !location || !expiration_date || !user_id) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }
  const result = await query(
    `INSERT INTO food_items (name, quantity, location, expiration_date, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
    [name, quantity, location, expiration_date, user_id]
  );
  return new Response(JSON.stringify(result.rows[0]), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
