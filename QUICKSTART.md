# Slate - Quick Start Guide

## 🚀 Easiest Way: Run Both Servers at Once

From the **root directory** (`/Bloom`):

```bash
# First time: Install all dependencies
npm run install:all

# Run both backend + frontend together
npm run dev
```

This will start:
- Backend on `http://localhost:5001`
- Frontend on `http://localhost:5173`

---

## 🔧 Manual Setup (if needed)

### 1. Start Backend

```bash
cd backend

# First time only: Set up database
# Copy .env.example to .env and configure DATABASE_URL
npx prisma db push
npx prisma generate

# Start the server
npm run dev
```

Backend runs on `http://localhost:5001`

### 2. Start Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🎯 Test the App

1. Visit `http://localhost:5173`
2. Click "Sign up" to create an account
3. After signup, you'll be automatically logged in
4. Try the dark mode toggle (moon/sun icon)
5. Logout and login again to test auth

---

## What's Working Now

✅ **Backend**: Full API (Auth, Notes, Tasks, Folders, Tags, Uploads)  
✅ **Frontend**: Login/Signup, Protected Routes, Theme Toggle  
⏳ **Next**: Notes Editor UI, Tasks Page, Search

---

## Environment Variables

### Backend `.env`
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/slate"
JWT_ACCESS_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-key-change-in-production
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 📝 Available Scripts

From root directory:
- `npm run dev` - Run both servers concurrently
- `npm run dev:backend` - Run only backend
- `npm run dev:frontend` - Run only frontend
- `npm run install:all` - Install all dependencies
