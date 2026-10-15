import { query } from './db.js';
import { User } from '../domain/user.entity.js';

export class UserRepository {
  async findByUsername(username) {
    try {
      const res = await query(
        'SELECT id, username, password_hash as "passwordHash", role FROM users WHERE username = $1',
        [username]
      );
      if (res.rows.length === 0) {
        return null;
      }
      const row = res.rows[0];
      return new User(row.id, row.username, row.passwordHash, row.role);
    } catch (error) {
      console.error('[UserRepository] Error al consultar usuario en PostgreSQL:', error.message);
      throw error;
    }
  }

  async createUser(username, passwordHash, role = 'User') {
    const res = await query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, passwordHash, role]
    );
    const row = res.rows[0];
    return new User(row.id, row.username, passwordHash, row.role);
  }

  async getAllUsers() {
    const res = await query('SELECT id, username, role, created_at FROM users ORDER BY id ASC');
    return res.rows;
  }
}