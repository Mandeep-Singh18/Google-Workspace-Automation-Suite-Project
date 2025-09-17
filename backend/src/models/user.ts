import { pool } from '../config/db';

export interface User {
  id: number;
  googleid: string;
  name: string;
  email: string;
  createdat: Date;
}

interface NewUser {
  googleId: string;
  name: string;
  email: string;
}

export class UserModel {
 
  static async findByGoogleId(googleId: string): Promise<User | null> {
    // FIX: Changed "googleId" to "googleid" to match the database column
    const query = 'SELECT * FROM users WHERE googleid = $1';
    const { rows } = await pool.query(query, [googleId]);
    return rows[0] || null;
  }

  static async create(userData: NewUser): Promise<User> {
    const { googleId, name, email } = userData;
    // FIX: Changed "googleId" to "googleid"
    const query = 'INSERT INTO users (googleid, name, email) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [googleId, name, email]);
    return rows[0];
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }
}