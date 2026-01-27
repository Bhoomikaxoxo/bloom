# Slate - Notes & Tasks Workspace

<div align="center">
  
**A sleek, production-grade full-stack notes and todo app**

Built with React + Node.js + PostgreSQL

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [API Documentation](#api-documentation) • [Deployment](#deployment)

</div>

---

## 🎯 Features

### ✅ Implemented (Backend Foundation)

#### **Authentication**
- ✅ Secure signup/login with bcrypt password hashing
- ✅ JWT access + refresh token system with rotation
- ✅ Forgot password flow (ready for email integration)
- ✅ Protected API routes

#### **Notes Module**
- ✅ Full CRUD operations for notes
- ✅ Rich text storage (JSON format, Tiptap-ready)
- ✅ Pin/Favorite notes
- ✅ Soft delete (trash) with restore functionality
- ✅ Version history (keeps last 5 versions)
- ✅ Full-text search
- ✅ Folder organization

#### **Tasks Module**
- ✅ Standalone tasks with due dates & priorities
- ✅ **Embedded tasks** linked to notes via `sourceId` for reliable syncing
- ✅ Bulk sync endpoint for checklist items
- ✅ Filter by status, priority, note
- ✅ Search functionality

#### **Organization**
- ✅ Folders with unique constraints
- ✅ Tags with colors and unique constraints
- ✅ Tag associations for notes and tasks

#### **File Uploads**
- ✅ Image upload to Cloudinary
- ✅ File validation (type + size)
- ✅ Secure upload endpoint

### 🚧 Remaining (Frontend UI)

- [ ] Design System & Layout (AppShell, Theme)
- [ ] Auth Pages & Protected Routing
- [ ] Notes UI (3-Panel Layout)
- [ ] Rich Text Editor (Tiptap Integration)
- [ ] Todo UI (Standalone & Notes Integration)
- [ ] Embedded Tasks Logic (Frontend Syncing)
- [ ] Version History UI
- [ ] Global Search UI
- [ ] Settings Page
- [ ] Final Polish (Animations, Toasts, Skeletons)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS  (Glass morphism + gradient backgrounds)
- **State Management**: Zustand (UI state), TanStack Query (server state)
- **Routing**: React Router DOM v7
- **Rich Text**: Tiptap (planned)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **File Storage**: Cloudinary
- **Security**: Helmet, CORS

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon/Supabase recommended for free tier)
- Cloudinary account (free tier)

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and fill in:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   JWT_ACCESS_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-secret
   ```

4. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```
   
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Copy `.env.example` to `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```
   
   App runs on `http://localhost:5173`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new account |
| POST | `/auth/login` | Login with credentials |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Revoke refresh token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

### Notes Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | List all notes (supports filters) |
| POST | `/notes` | Create new note |
| GET | `/notes/:id` | Get note by ID |
| PUT | `/notes/:id` | Update note |
| DELETE | `/notes/:id` | Delete note (soft/hard) |
| GET | `/notes/trash` | List trashed notes |
| POST | `/notes/:id/restore` | Restore from trash |
| GET | `/notes/:id/versions` | Get version history |
| POST | `/notes/:id/versions/restore` | Restore a version |

### Tasks Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks (supports filters) |
| POST | `/tasks` | Create new task |
| GET | `/tasks/:id` | Get task by ID |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/sync/:noteId` | **Bulk sync embedded tasks** |

### Folders & Tags (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/folders` | List/Create folders |
| PUT/DELETE | `/folders/:id` | Update/Delete folder |
| GET/POST | `/tags` | List/Create tags |
| PUT/DELETE | `/tags/:id` | Update/Delete tag |

### Uploads (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/uploads/image` | Upload image (multipart) |

---

## 🗄 Database Schema Highlights

### Key Design Decisions

✅ **Embedded Tasks**: `Task` model has `source` (STANDALONE/NOTE) and `sourceId` fields with unique constraint `[userId, sourceId]` to prevent duplicates during syncing.

✅ **Soft Delete**: `Note.deletedAt` (DateTime) for trash functionality instead of boolean flags.

✅ **Unique Constraints**: `Folder` and `Tag` models have `@@unique([userId, name])` to prevent duplicate names per user.

✅ **Version History**: `NoteVersion` model stores up to 5 previous content snapshots per note.

---

## 🚀 Deployment

### Recommended Free Stack

- **Frontend**: Vercel
- **Backend**: Render (free tier)
- **Database**: Neon or Supabase (PostgreSQL)
- **Storage**: Cloudinary (free tier)

### Deploy Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository, select `backend` directory
4. Add environment variables
5. Build command: `npm install && npx prisma generate`
6. Start command: `npm start`

### Deploy Frontend (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Set root directory to `frontend`
4. Add `VITE_API_URL` environment variable
5. Deploy

### Database Setup (Neon)

1. Create Neon account (free)
2. Create new database
3. Copy connection string
4. Run migrations: `npx prisma migrate deploy`

---

## 🧩 Project Structure

```
Slate/
├── backend/
│   ├── src/
│   │   ├── config/          # Prisma, Cloudinary
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # AppError
│   │   ├── validators/      # Zod schemas
│   │   └── index.js         # Express app
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css         # Tailwind + Glass UI
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🎨 UI Design Principles (Planned)

- **Glass Morphism**: Blurred panels with subtle borders
- **Gradient Backgrounds**: Soft blue/indigo gradients with noise texture
- **Centered Editor**: Max-width writing column like Notion/Craft
- **Floating Toolbar**: Sticky Tiptap toolbar with tooltips
- **Subtle Animations**: Framer Motion micro-interactions
- **Typography**: Inter font with proper spacing

---

## 📝 Next Steps

To complete the full application, implement the following frontend modules in order:

1. **Auth UI** → Login/Signup pages with protected routes
2. **Design System** → Button, Input, Card, Modal components
3. **3-Panel Layout** → Sidebar(folders) + Notes List + Editor
4. **Tiptap Editor** → Full toolbar with image upload
5. **Embedded Tasks** → Checklist syncing logic
6. **Polish** → Toasts, skeletons, search modal, settings

---

## 📄 License

ISC

--- 

**Built with ❤️ using modern web technologies**
