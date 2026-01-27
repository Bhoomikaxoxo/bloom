# 🛠️ Database Setup Guide

The backend crashed because the database isn't set up yet. Here's how to fix it:

## Option 1: Use Prisma Local Database (Easiest for Testing)

1. **Start the Prisma database server** (in a separate terminal):
   ```bash
   cd backend
   npx prisma dev
   ```
   This will start a local PostgreSQL server on ports 51213-51215.

2. **Run the setup script** (in another terminal):
   ```bash
   cd backend
   ./setup-db.sh
   ```

3. **Start the dev servers**:
   ```bash
   cd ..  # back to root
   npm run dev
   ```

## Option 2: Use a Free Cloud Database (Recommended for Production)

### Using Neon (Free permanent PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string
4. Update `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/database?sslmode=require"
   ```
5. Run setup:
   ```bash
   cd backend
   ./setup-db.sh
   ```

### Using Supabase (Also Free)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Project Settings → Database
4. Copy the "Connection string" (URI mode)
5. Update `backend/.env` with the connection string
6. Run `./setup-db.sh`

---

## Current Issue

The Prisma local database server at `localhost:51213` isn't running. 

**Quick fix:** Run `npx prisma dev` in the backend directory (separate terminal), then run `npm run dev` from the root.

---

## After Database is Set Up

Once the database is configured and migrations are complete, just run:

```bash
npm run dev
```

This will start both backend and frontend together! 🚀
