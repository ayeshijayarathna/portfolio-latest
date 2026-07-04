// Base URL for the backend API.
// In production (Vercel), set VITE_API_URL in the frontend project's
// Environment Variables to your backend's deployed URL, e.g.
//   https://portfolio-latest-pi-nine.vercel.app
// In local development, leave VITE_API_URL unset — requests will be
// relative ('/api/...') and handled by the Vite dev server proxy.
export const API_BASE_URL = import.meta.env.VITE_API_URL || ''