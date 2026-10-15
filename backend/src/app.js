import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { loginController, dashboardController, healthController } from './interfaces/controllers/auth.controller.js';
import { authenticateJWT } from './interfaces/middlewares/auth.middleware.js';
import { initDB } from './infrastructure/db.js';

dotenv.config();

const app = express();

// Confianza en el proxy inverso (Nginx) para obtener la IP real del cliente
app.set('trust proxy', true);

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas Públicas
app.get('/api/health', healthController);
app.post('/api/auth/login', loginController);

// Rutas Protegidas (Zero Trust)
app.get('/api/dashboard/data', authenticateJWT, dashboardController);

const PORT = parseInt(process.env.PORT || '3000', 10);

// Iniciar DB y escuchar
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BACKEND] Servidor ejecutándose en http://0.0.0.0:${PORT}`);
    console.log(`[BACKEND] Orígenes CORS permitidos: ${corsOrigin}`);
  });
});