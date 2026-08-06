# KaamSathi - DevOps, Deployment & Architecture Guide

## 🏛️ System Architecture

KaamSathi is built on a modern full-stack architecture:
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js REST API with modular controllers and routes.
- **Database**: MongoDB Atlas (Cloud) / Mongoose ODM.
- **AI Engine**: Google Gemini API integration for smart matching, demand prediction, pricing insights, and automated customer support.
- **DevOps & Containerization**: Docker, Docker Compose, GitHub Actions CI/CD pipeline.

---

## 🚀 Deployment Instructions

### 1. Frontend & Admin Dashboard (Vercel / Netlify)
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`

### 2. Backend API Service (Render / Railway / AWS)
- Start Command: `npm start` (or `node dist/server.cjs`)
- Environment Variables required:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `GEMINI_API_KEY`
  - `PORT=3000`

### 3. Docker Local & Production Setup
```bash
# Build and run with Docker Compose
docker-compose up --build -d
```

---

## 🔒 Security & Compliance
- **Helmet**: Secure HTTP headers protection.
- **CORS & Rate Limiting**: Prevent abuse and DDOS attacks.
- **Input Sanitization**: MongoDB injection & XSS defense.
- **JWT Authentication**: Role-based access control (Admin, Worker, Customer).

---

## 💾 Backup & Disaster Recovery
- **MongoDB Atlas Automated Backups**: Daily snapshots with 7-day point-in-time recovery.
- **Weekly Cold Storage Backups**: Encrypted JSON exports archived to secure cloud object storage.
