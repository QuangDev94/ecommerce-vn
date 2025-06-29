import NextAuth from 'next-auth'
import authConfig from './auth.config'

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  // Match all request paths except for the ones starting with:
  // api (API routes)
  // _next/static (static files)
  // _next/image (image optimization files)
  // favicon file
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
