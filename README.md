# Momentum

**Blockers Tracker & Insights Platform**

Momentum is an internal productivity tool that enables team members to log daily blockers, analyze productivity patterns, and provides managers with team-wide insights powered by AI.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Contentstack Setup](#contentstack-setup)
- [Google OAuth Setup](#google-oauth-setup)
- [Running with PM2](#running-with-pm2)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22.x
- **PM2** (optional, for process management): `npm install -g pm2`

You'll also need accounts for:

- [Contentstack](https://www.contentstack.com/) - CMS for data storage
- [Google Cloud Console](https://console.cloud.google.com/) - OAuth authentication
- [OpenAI](https://platform.openai.com/) - AI report generation (optional)

---

## Quick Start

```bash
# 1. Clone the repository
git clone git@github.com:dsouzamanish/trace.git
cd trace

# 2. Setup Backend
cd backend
cp env.example .env
# Edit .env with your credentials
npm install

# 3. Setup Frontend
cd ../frontend
cp .env.example .env
# Edit .env with your credentials
npm install

# 4. Start both applications
cd ..
pm2 start startup.json

# Or start individually:
# Backend: cd backend && npm run start:dev
# Frontend: cd frontend && npm start
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
PORT=3001

# Contentstack Configuration
CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token
CONTENTSTACK_ENVIRONMENT=development
CONTENTSTACK_REGION=NA

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# JWT Configuration
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRATION=7d

# OpenAI Configuration (for AI Reports)
OPENAI_API_KEY=your_openai_api_key

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

### 4. Run Database Migration

Create Contentstack content types:

```bash
# Start the backend first
npm run start:dev

# In another terminal, run migration
curl -X POST http://localhost:3001/api/migration/run
```

### 5. Seed Sample Data (Optional)

```bash
curl -X POST http://localhost:3001/api/migration/seed
```

### 6. Start the Backend

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The backend will be available at **http://localhost:3001**

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Google OAuth (same Client ID as backend)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Start the Frontend

```bash
# Development mode
npm start

# Production build
npm run build
```

The frontend will be available at **http://localhost:3000**

---

## Contentstack Setup

### 1. Create a Stack

1. Log in to [Contentstack](https://app.contentstack.com/)
2. Create a new Stack or use an existing one
3. Note down your **Stack API Key**

### 2. Create Tokens

#### Delivery Token
1. Go to **Settings** → **Tokens** → **Delivery Tokens**
2. Click **+ Add Token**
3. Name: `Momentum Delivery`
4. Environment: Select your environment (e.g., `development`)
5. Save and copy the token

#### Management Token
1. Go to **Settings** → **Tokens** → **Management Tokens**
2. Click **+ Add Token**
3. Name: `Momentum Management`
4. Permissions: Select **Read/Write** for Content Types and Entries
5. Save and copy the token

### 3. Create Environment

1. Go to **Settings** → **Environments**
2. Create an environment named `development`
3. Set the base URL (can be any placeholder URL)

### 4. Run Migration

After configuring your `.env` file with Contentstack credentials:

```bash
# This creates all required content types
curl -X POST http://localhost:3001/api/migration/run
```

Expected output:
```json
[
  {"success":true,"contentType":"Team Member","action":"created"},
  {"success":true,"contentType":"Blocker","action":"created"},
  {"success":true,"contentType":"AI Report","action":"created"}
]
```

---

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** (or People API)

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in required fields:
   - App name: `Momentum`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email) if in testing mode

### 3. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Momentum Web Client`
5. Add Authorized redirect URIs:
   ```
   http://localhost:3001/api/auth/google/callback
   ```
6. Save and copy **Client ID** and **Client Secret**

### 4. Update Environment Variables

Add the credentials to both backend and frontend `.env` files.

> ⚠️ **Important:** The callback URL must include `/api` prefix as NestJS uses a global route prefix.

---

## Running with PM2

PM2 provides process management, auto-restart, and log management.

### Start Applications

```bash
# Using startup.json (recommended)
pm2 start startup.json

# Or using ecosystem.config.js
pm2 start ecosystem.config.js
```

### PM2 Commands

```bash
# View running processes
pm2 list

# View logs
pm2 logs                          # All logs
pm2 logs momentum-backend         # Backend only
pm2 logs momentum-frontend        # Frontend only

# Restart applications
pm2 restart momentum-backend
pm2 restart momentum-frontend
pm2 restart all

# Stop applications
pm2 stop momentum-backend
pm2 stop momentum-frontend
pm2 stop all

# Delete from PM2
pm2 delete all

# Monitor resources
pm2 monit
```

### Log Files

Logs are stored in the `logs/` directory:

```
logs/
├── backend-out.log      # Backend stdout
├── backend-error.log    # Backend stderr
├── frontend-out.log     # Frontend stdout
└── frontend-error.log   # Frontend stderr
```

---

## API Documentation

### Swagger UI

Once the backend is running, access the API documentation at:

**http://localhost:3001/api/docs**

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/team-members` | List team members |
| GET | `/api/blockers` | List blockers |
| POST | `/api/blockers` | Create blocker |
| POST | `/api/ai-reports/generate/individual` | Generate AI report |
| POST | `/api/migration/run` | Run migrations |
| POST | `/api/migration/seed` | Seed sample data |

---

## Troubleshooting

### Common Issues

#### 1. `redirect_uri_mismatch` on Google Sign-in

**Cause:** OAuth callback URL mismatch

**Solution:** Ensure the callback URL in Google Cloud Console exactly matches:
```
http://localhost:3001/api/auth/google/callback
```

#### 2. `Cannot read properties of undefined (reading 'Stack')`

**Cause:** Contentstack SDK import issue

**Solution:** This is handled in the codebase. If you see this error, ensure you're using the latest code.

#### 3. Migration fails with "cannot set json data type"

**Cause:** Contentstack doesn't support `json` field type

**Solution:** The codebase uses `text` with multiline for JSON storage. Run migration again.

#### 4. Content type creation fails with "display_type missing"

**Cause:** Enum fields require `display_type` property

**Solution:** Already fixed in the schema files. Run migration again.

#### 5. Backend fails to start - "EADDRINUSE"

**Cause:** Port 3001 already in use

**Solution:**
```bash
# Find and kill the process
lsof -i :3001
kill -9 <PID>

# Or change PORT in .env
PORT=3002
```

#### 6. Frontend can't connect to backend

**Cause:** CORS or incorrect API URL

**Solution:**
1. Ensure backend is running on port 3001
2. Check `REACT_APP_API_URL` in frontend `.env`
3. Backend CORS is configured to allow `http://localhost:3000`

### Getting Help

1. Check `context.md` for implementation details and decisions
2. Review `prd.md` for product requirements
3. Check PM2 logs: `pm2 logs`

---

## Project Structure

```
trace/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── common/          # Guards, decorators, DTOs
│   │   └── modules/         # Feature modules
│   ├── env.example          # Environment template
│   └── package.json
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   └── services/        # API services
│   └── package.json
├── logs/                    # PM2 log files
├── .cursorrules             # Cursor AI guidelines
├── context.md               # Project documentation
├── prd.md                   # Product requirements
├── startup.json             # PM2 configuration
└── README.md                # This file
```

---

## License

Internal use only.

---

*For detailed implementation decisions and progress tracking, see `context.md`*

