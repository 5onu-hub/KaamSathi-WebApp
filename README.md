# KaamSathi - Enterprise Monorepo Architecture

Connecting Workers. Creating Opportunities. Building Trust. India's trusted digital labour marketplace empowering daily wage workers with direct bookings and zero commission.

## Monorepo Structure

```
KaamSathi/
│
├── client/              # Customer & Worker React + Vite Application
├── admin/               # Separate Admin Dashboard React + Vite Application
├── server/              # Backend Express + MongoDB REST API Service
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB / MongoDB Atlas

### Installation

1. Install root & client dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in:
   - `client/.env`
   - `admin/.env`
   - `server/.env`

3. Run development servers:
   ```bash
   npm run dev
   ```

## License
MIT KaamSathi Technologies India Pvt. Ltd.
