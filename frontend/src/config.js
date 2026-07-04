// Base URL for the backend API.
// In production (Vercel), set VITE_API_URL in the frontend project's
// Environment Variables to your backend's deployed URL, e.g.
//   https://portfolio-latest-pi-nine.vercel.app
// In local development, leave VITE_API_URL unset — requests will be
// relative ('/api/...') and handled by the Vite dev server proxy.
export const API_BASE_URL = import.meta.env.VITE_API_URL || ''

// Wraps fetch with a couple of retries for transient failures — mainly
// 500/503 errors caused by the backend's serverless function still
// establishing its MongoDB connection on a cold start. Safe to use for
// GET requests; does not retry 4xx client errors.
export async function fetchWithRetry(url, options = {}, retries = 2, delayMs = 600) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options)
      if (res.ok) return res
      // Only retry on server-side errors (cold start / DB connection races)
      if (res.status >= 500 && attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)))
        continue
      }
      return res
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)))
        continue
      }
      throw err
    }
  }
}