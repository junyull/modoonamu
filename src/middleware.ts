import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 템플릿 페이지는 인증 없이 접근 가능
  if (request.nextUrl.pathname.startsWith('/templates/')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/templates/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 