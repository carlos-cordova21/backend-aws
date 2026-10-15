# Backend AWS - Zero Trust & Defense in Depth

Arquitectura de seguridad en la nube (AWS) implementando el principio de **Defensa en Profundidad** y modelo **Zero Trust**.

## Componentes de la Arquitectura
- **VPC Frontend (DMZ Pública):** Nginx como Reverse Proxy con Security Headers estrictos (`Content-Security-Policy`, `Permissions-Policy`, `X-Frame-Options`, `X-Content-Type-Options`).
- **VPC Backend (Subred Privada Aislada):** API REST en Node.js (Express) accesible únicamente a través de VPC Peering / IPs autorizadas.
- **Base de Datos:** PostgreSQL con hashes `bcrypt` (10 rounds) y consultas SQL parametrizadas contra inyecciones SQL.
- **Autenticación Continua:** Tokens JWT firmados con clave HMAC SHA-256.
- **Detección y Prevención de Intrusos (IPS):** Fail2Ban con cárcel específica para monitorear intentos de fuerza bruta en `/api/auth/login`.
- **Protección SSRF:** Verificación de metadatos de instancia EC2 bajo el estándar **IMDSv2** con tokens de sesión temporales.

## Archivos de Infraestructura
- `nginx.conf`: Configuración del servidor Nginx y cabeceras de seguridad.
- `fail2ban-jail.local`: Configuración de jaula para Fail2Ban (3 reintentos fallidos = 1 hora de baneo).
- `fail2ban-filter.conf`: Expresión regular para capturar errores 401 en `/api/auth/login`.
- `check-meta.sh`: Script para auditar metadatos de la instancia EC2 mediante IMDSv2.
- `backend/`: Código fuente de la API REST Node.js estructurado bajo Clean Architecture.

## Ejecución Local del Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
