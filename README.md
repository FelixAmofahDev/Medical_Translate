# MediTranslate Frontend

Medical Twi → English translation assistant for clinical consultations.

## Prerequisites

- Node.js 18+
- npm
- Backend API running (`VITE_API_BASE_URL`)
- Firebase project with Email/Password and Google auth enabled

## Setup

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Notes

- The frontend sends audio to the backend translation endpoint. All AI processing happens server-side.
- This tool is for translation only. Clinical information should always be verified by the physician.
