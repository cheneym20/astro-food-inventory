import { Pool } from 'pg';

// Create a single pool instance for the whole app
const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  // Optionally, add more config here (e.g., ssl, max connections)
});

// Typed query helper for reusability
export async function query<T = any>(text: string, params?: unknown[]): Promise<{ rows: T[] }> {
  const result = await pool.query(text, params);
  return { rows: result.rows as T[] };
}

// Optionally, export the pool for advanced use (transactions, etc.)
export { pool };

export async function get_shopping_items() {
  const { rows } = await pool.query('SELECT * FROM shopping_list_items');
  return rows;
}

export async function getAllFoodItems() {
  const { rows } = await pool.query('SELECT * FROM food_items');
  return rows;
}