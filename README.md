# TheFifthSuite — Premium Tarot Reading Website

A fully functional, production-grade React SPA with glassmorphism UI.

## Setup & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

## Stack
- React 18 + React Router v6
- Framer Motion (all animations)
- Tailwind CSS (layout utilities)
- Lucide React (icons)
- Google Fonts: Cormorant Garamond, Cinzel, Raleway

## Pages
- `/` — Home (hero, about, testimonials, booking types, daily draw CTA)
- `/booking` — Category selection (Love, Career, Soul Purpose, Future, Health, Divine Timing)
- `/booking/:categoryId` — Booking form with category theming + validation
- `/daily-draw` — Interactive 78-card tarot spread with AI reading via Claude API
- `/login` — Sign In / Create Account UI

## AI Reading (Daily Draw)
The Daily Draw calls the Anthropic API for real AI-powered readings. 
If no API key is configured (frontend-only), a beautiful mock reading is shown.

To enable real readings, the API call is at:
`src/pages/DailyDraw.jsx` — the `fetchReading` function

Note: In production, move the API call to a backend to protect your API key.
