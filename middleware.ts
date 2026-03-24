import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

/**
 * Refreshes Supabase session cookies on navigation (SSR + client).
 * Does not redirect unauthenticated users: “protected” UI routes use
 * `ProtectedRoute` (Supabase OR wallet). Wallet state is not available here.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
