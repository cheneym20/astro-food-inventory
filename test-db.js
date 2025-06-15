import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect()
  .then(() => client.query('SELECT NOW()'))
  .then(res => {
    console.log('Connection successful! Current time:', res.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('Connection failed:', err);
    client.end();
  });
