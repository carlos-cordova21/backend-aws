import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_super_segura_zero_trust';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

export class JwtService {
  generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
  }

  verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
  }
}