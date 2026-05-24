# 🤖 AI Interview Preparation Platform

### 🌐 Live Deployments
- **Frontend App**: [https://frontend-snowy-eta-72.vercel.app](https://frontend-snowy-eta-72.vercel.app)
- **Backend API**: [https://backend-delta-ochre-28.vercel.app](https://backend-delta-ochre-28.vercel.app)
- **GitHub Repository**: [https://github.com/sheetanshumohan/AI-Interview-Preparation-Platform](https://github.com/sheetanshumohan/AI-Interview-Preparation-Platform)

---

## 🚀 Key Features

### 👤 Candidate Dashboard
- **Dashboard Analytics**: Tracks practice progress, overall scores, and preparation stats with interactive charts (using Recharts).
- **Resume Analysis**: Scan and evaluate resumes against specific job roles using AI. Get detailed scores, key improvement areas, and recommended topics.
- **AI Mock Interview Simulator**: Experience realistic, role-tailored technical and behavioral mock interviews with live response tracking.
- **Answer Evaluation**: Instant AI-powered grading of answers. Receive feedback, ideal answers, constructive suggestions, and score breakdown.
- **Dynamic AI Question Generator**: Generates customized interview questions based on job description, technology stack, and difficulty level.
- **HR & Behavioral Round Practice**: Specialized modules for standard and scenario-based HR questions.
- **Interview History & Saved Questions**: Track performance over time and bookmark difficult questions for future practice.

### 🛡️ Administrative Portal
- **Admin Dashboard**: System-wide analytics overview including active users, total mock interviews conducted, and API usage stats.
- **User Management Hub**: View detailed user profiles, edit roles (user/admin), and manage account statuses.
- **System Settings**: Hot-swap configurations, rotation of API keys, and rate-limiting limits.
- **Audit Logs**: Deep security log tracking to audit system events and administrative operations.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS (v4) with modern variables
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts & Visuals**: Recharts & Lucide Icons
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js (v5)
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Passport.js (Google OAuth 2.0, GitHub OAuth, and local JWT authentication)
- **File Uploads**: Multer (for PDF resume parsing)
- **AI Integration**: `@google/generative-ai` & `openai` SDKs

---

## 📂 Project Structure

```
AI-Interview-Preparation-Platform/
├── backend/
│   ├── config/             # Passport, Database, and Server configurations
│   ├── controllers/        # Request handling logic (Auth, AI, Admin, etc.)
│   ├── db/                 # Database connection utilities
│   ├── middleware/         # Auth verification and rate limiters
│   ├── models/             # Mongoose schemas (User, Interview, Log, etc.)
│   ├── routes/             # API routes definition
│   ├── uploads/            # Temporary directory for file uploads
│   ├── server.js           # Server entrypoint
│   └── package.json
│
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # App images and logos
│   │   ├── components/     # Reusable layout and UI elements
│   │   ├── lib/            # Axios API client setup
│   │   ├── pages/          # Individual screen components
│   │   ├── store/          # Zustand global state stores
│   │   ├── App.jsx         # App router and layouts
│   │   └── main.jsx        # Client entrypoint
│   └── package.json
│
└── .gitignore              # Project-wide ignores
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the **backend** directory with the following keys:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# AI APIs
OPENAI_API_KEY=your_openai_api_key

# URL Configurations
CLIENT_URL=http://localhost:5173
```

---

## 💻 Local Installation & Run

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/sheetanshumohan/AI-Interview-Preparation-Platform.git
cd AI-Interview-Preparation-Platform
```

### 2. Set Up Backend
```bash
cd backend
npm install
# Create .env and configure environment variables
npm run dev
```

### 3. Set Up Frontend
```bash
cd ../frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🌐 Production Deployment

### Backend Deployment (Vercel Serverless)
Configure a `vercel.json` file in the root or backend directory to route `/api/*` to your Node.js application:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Frontend Deployment (Vercel SPA)
- Set root directory to `frontend` or build configuration to output `dist`.
- Set Environment Variables:
  - `VITE_API_URL`: Points to your deployed live backend API (e.g., `https://api.yourdomain.com/api`).
  - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID configured with the production origin.
