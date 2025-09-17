import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      googleId VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      createdAt TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      userId INTEGER NOT NULL REFERENCES users(id),
      title VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending',
      createdAt TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  try {
    await pool.query(createUsersTable);
    await pool.query(createTasksTable);
    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};