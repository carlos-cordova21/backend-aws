import { JwtService } from '../../infrastructure/jwt.service.js';

const jwtService = new JwtService();

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado: Token faltante' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwtService.verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};