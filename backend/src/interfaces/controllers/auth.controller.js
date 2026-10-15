import { AuthUseCase } from '../../application/auth.usecase.js';
import { UserRepository } from '../../infrastructure/user.repository.js';
import { JwtService } from '../../infrastructure/jwt.service.js';
import { logger } from '../../infrastructure/logger.js';
import pool from '../../infrastructure/db.js';

const userRepository = new UserRepository();
const jwtService = new JwtService();
const authUseCase = new AuthUseCase(userRepository, jwtService);

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || '127.0.0.1';
};

export const loginController = async (req, res) => {
  const clientIp = getClientIp(req);
  const { username, password } = req.body || {};

  // Validación de entradas
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    logger.authFailure(clientIp, username || 'desconocido', 'Campos requeridos faltantes o inválidos');
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  try {
    const result = await authUseCase.login(username.trim(), password);
    logger.authSuccess(clientIp, result.user.username);
    return res.status(200).json(result);
  } catch (error) {
    logger.authFailure(clientIp, username, error.message);
    return res.status(401).json({ error: error.message });
  }
};

export const dashboardController = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    return res.status(200).json({
      message: 'Acceso concedido al Dashboard seguro (VPC Backend - Zero Trust)',
      user: req.user,
      security: {
        architecture: 'Defense in Depth / Zero Trust',
        vpcZone: 'Private Backend VPC (Sin salida directa a Internet)',
        authMethod: 'Continuous JWT Authentication (HMAC SHA-256)',
        totalRegisteredUsers: users.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(200).json({
      message: 'Acceso concedido al Dashboard seguro (VPC Backend)',
      user: req.user,
      security: {
        architecture: 'Defense in Depth / Zero Trust',
        vpcZone: 'Private Backend VPC'
      },
      timestamp: new Date().toISOString()
    });
  }
};

export const healthController = async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error: ' + err.message;
  }

  return res.status(200).json({
    status: 'UP',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};