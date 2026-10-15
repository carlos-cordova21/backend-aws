import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'zerotrust_db',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const query = (text, params) => pool.query(text, params);

export async function initDB() {
  try {
    console.log(`[DB] Conectando a PostgreSQL en ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'} (BD: ${process.env.DB_NAME || 'zerotrust_db'})...`);
    
    // Crear tabla users si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'User',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[DB] Tabla "users" verificada/creada correctamente.');

    // Verificar si existe el usuario admin inicial
    const res = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);
    if (res.rowCount === 0) {
      const defaultHash = await bcrypt.hash('password123', 10);
      await pool.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
        ['admin', defaultHash, 'Administrador']
      );
      console.log('[DB] Usuario "admin" creado con éxito (pass: password123).');
    } else {
      console.log('[DB] Usuario "admin" ya existe en la base de datos.');
    }

    return true;
  } catch (error) {
    console.error('[DB ERROR] Error inicializando PostgreSQL:', error.message);
    console.warn('[DB WARNING] El backend continuará, pero verifica las credenciales de la base de datos.');
    return false;
  }
}

export default pool;
