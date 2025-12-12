# Momentum Frontend

React frontend for the Momentum - Blockers Tracker & Insights Platform.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Build Tool**: Vite
- **Hosting**: Contentstack Launch

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running

## Setup

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Configure environment**

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

## Running the Application

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## Features

### Personal Dashboard
- Overview of your blockers with stats
- Weekly trend visualization
- Category breakdown chart
- Quick blocker creation

### My Blockers
- Full list of your blockers
- Filter by category, severity, status
- Update blocker status
- Add new blockers

### AI Insights
- Generate AI-powered reports
- View historical reports
- Actionable recommendations
- Pattern analysis

### Team Dashboard (Managers)
- Team-wide blocker overview
- Team statistics and trends
- Generate team reports
- Monitor team productivity

## Project Structure

```
frontend/
├── public/
│   └── momentum.svg      # App icon
├── src/
│   ├── components/
│   │   ├── ai-report/    # AI report components
│   │   ├── blockers/     # Blocker components
│   │   ├── common/       # Shared components
│   │   └── dashboard/    # Dashboard components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── store/
│   │   └── slices/       # Redux slices
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Deployment to Contentstack Launch

1. Build the application:
```bash
npm run build
```

2. The `dist` folder contains the production build

3. Deploy to Contentstack Launch:
   - Create a new Launch project
   - Connect your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Output directory: `dist`
   - Set environment variables

## Design System

### Colors
- **Primary**: Blue (#5c7cfa) - Main actions and accents
- **Accent**: Orange (#ff922b) - CTAs and highlights
- **Severity**: Green/Yellow/Red for Low/Medium/High
- **Background**: Dark theme with gradient overlays

### Typography
- **Display**: Outfit - Headlines and titles
- **Body**: DM Sans - Body text
- **Mono**: JetBrains Mono - Code and technical content

### Components
- Cards with glass-morphism effect
- Animated transitions
- Consistent badge styling
- Responsive grid layouts

