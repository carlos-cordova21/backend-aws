import fs from 'fs';
import path from 'path';

const logFilePath = process.env.AUTH_LOG_FILE || './logs/auth-api.log';

// Asegurar que el directorio de logs exista si es relativo
try {
  const dir = path.dirname(path.resolve(logFilePath));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
} catch (err) {
  console.warn('[LOGGER] No se pudo asegurar el directorio de log:', err.message);
}

function writeLog(line) {
  console.log(line);
  try {
    fs.appendFileSync(logFilePath, line + '\n', 'utf8');
  } catch (err) {
    // Si no tiene permisos (ej. /var/log sin root), continúa en consola
  }
}

export const logger = {
  authSuccess(ip, username) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [AUTH_SUCCESS] IP: ${ip} | User: ${username}`;
    writeLog(line);
  },

  authFailure(ip, username, reason = 'Credenciales inválidas') {
    const timestamp = new Date().toISOString();
    // Formato estricto para Fail2Ban: [AUTH_FAILURE] IP: <HOST>
    const line = `[${timestamp}] [AUTH_FAILURE] IP: ${ip} | User: ${username} | Reason: ${reason}`;
    writeLog(line);
  },

  info(msg) {
    const timestamp = new Date().toISOString();
    writeLog(`[${timestamp}] [INFO] ${msg}`);
  },

  error(msg, err) {
    const timestamp = new Date().toISOString();
    writeLog(`[${timestamp}] [ERROR] ${msg} ${err ? err.stack || err : ''}`);
  }
};
