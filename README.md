# BotPro Trading Dashboard Frontend

Frontend de Next.js para el sistema de señales de trading BotPro.

## Características

- ✅ Dashboard en tiempo real con señales de trading
- ✅ Mantiene el backend de Render activo con polling automático cada 30 segundos
- ✅ Actualización automática de señales cada minuto
- ✅ Estadísticas de rendimiento
- ✅ Interfaz moderna con Tailwind CSS

## Desarrollo Local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy en Vercel

1. Push el código a GitHub
2. Conecta el repositorio en Vercel
3. El deploy es automático

## Variables de Entorno

- `NEXT_PUBLIC_API_URL`: URL del backend (default: https://botpro-2p7g.onrender.com)

## Arquitectura

- **Frontend**: Next.js 14 en Vercel (gratis)
- **Backend**: FastAPI en Render (gratis)
- **Keep-Alive**: Polling automático cada 30 segundos mantiene el backend activo

## Endpoints del Backend

- `/health` - Health check (polling cada 30s)
- `/api/signals/enhanced` - Señales de trading (actualiza cada 60s)
- `/api/stats` - Estadísticas del sistema (actualiza cada 120s)