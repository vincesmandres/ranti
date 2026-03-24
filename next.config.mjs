import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Evita que Turbopack tome un package-lock.json fuera del repo (p. ej. en el home del usuario)
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Dev-only: allow HMR when opening the app from LAN IP / custom host (see .env.example)
  allowedDevOrigins: process.env.NEXT_ALLOWED_DEV_ORIGINS
    ? process.env.NEXT_ALLOWED_DEV_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
    : [],
}

export default nextConfig
