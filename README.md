# EmpowerCraft 🇮🇳

**EmpowerCraft** is a dual-portal, production-grade web platform designed for India's rural artisans, built on a **100% free / open-source / zero-cost** tech stack.

- 🛒 **Buyer Portal** — a modern e-commerce storefront under `/marketplace/*`
- 🎨 **Artisan Studio** — a voice-first, multi-page seller portal under `/artisan/*`

---

## Tech Stack (all free)

| Layer            | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| Framework        | Vite + React 18 + React Router (fully client-side SPA)  |
| Styling          | Tailwind CSS, Lucide Icons, Framer Motion               |
| Storage          | **Dexie.js / IndexedDB** (offline-first mock data)      |
| Speech AI        | **Web Speech API** — STT + TTS (28+ Indian languages)   |
| Background Remove| **@imgly/background-removal** (on-device ONNX/WebGPU)   |
| Geolocation      | `navigator.geolocation` + **OpenStreetMap Nominatim**    |
| Payments / IVR   | Simulated UPI QR, Web-Audio + native TTS ring/voice      |

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Routing map

- `/` — Landing / gateway
- `/marketplace/home`, `/explore`, `/product/:id`, `/cart`, `/checkout`, `/track-order/:id`
- `/artisan/auth`, `/dashboard`, `/studio/add-product`, `/inventory`, `/orders`,
  `/analytics-studio`, `/smart-wallet`, `/schemes`, `/milestones`, `/settings`

## Architecture

- `src/context/` — CartProvider, ArtisanProvider, VoiceProvider (global state + persistent FAB across the artisan portal)
- `src/data/` — Dexie DB, seed files (products, artisans, schemes, analytics), 28+ language catalog
- `src/lib/` — `speech.js` (Web Speech + Hindi intent parser), `bgremove.js` (client AI background removal with offline fallback)
- `src/components/` — portal layouts, Voice Assistant FAB, Indian-motif SVG art (peacock, lotus, mandala, temple)
- `src/pages/` — both portals' dedicated pages

## Notes

- All data is seeded into IndexedDB on first load; stock/price/product edits persist locally.
- Voice features need a browser with Web Speech API (Chrome/Edge) & may require a mic permission prompt.
- Payments, OTPs and IVR calls are **simulated** — nothing is charged and no real call is made.
- Official government scheme links route to the real portals; no application is actually filed.