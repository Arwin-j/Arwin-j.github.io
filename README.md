# MoneyLeak – Smart Expense & Subscription Tracker

Production-ready SaaS starter with:
- **Frontend:** Next.js + Tailwind + Zustand
- **Backend:** Express + Prisma
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt

## Project structure

- `frontend/` Next.js web app
- `backend/` Express API + Prisma schema + tests

## Local setup

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend runs on `http://localhost:4000`.

### 2) Frontend

```bash
cd frontend
cat > .env.local <<ENV
NEXT_PUBLIC_API_URL=http://localhost:4000
ENV
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Environment variables

### Backend (`backend/.env`)
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `CLIENT_URL`

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL`

## API endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET/POST /api/transactions`
- `POST /api/transactions/upload-csv`
- `POST /api/analytics/run-detection`
- `GET /api/analytics/dashboard`
- `GET/PATCH /api/analytics/subscriptions`
- `POST /api/analytics/insights/generate`
- `GET /api/analytics/insights`
- `GET /api/analytics/weekly-report`

## Smart detection implemented

- Recurring subscriptions by merchant + billing interval
- Unused subscriptions (no charge in 30+ days)
- Price increase detection (>15% increase)
- Duplicate expense detection (merchant + amount + date)
- Insights and potential savings calculation

## Testing

```bash
cd backend
npm test
```

## Deployment

### Database (Neon or Supabase)
1. Create PostgreSQL project.
2. Copy connection string to `DATABASE_URL`.
3. Run migrations:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

### Backend (Render/Railway)
1. Create web service from `backend` folder.
2. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
3. Start command: `npm start`
4. Set env vars: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CLIENT_URL`.

### Frontend (Vercel)
1. Import `frontend` folder.
2. Set env var `NEXT_PUBLIC_API_URL` to backend public URL.
3. Deploy.

## Notes
- Weekly report API is ready; email delivery hook can be added through a cron + SMTP provider.
- AI summaries can be added by posting generated insights to OpenAI API in `/api/analytics/insights/generate`.
