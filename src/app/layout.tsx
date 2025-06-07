import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '모두트리 - 나만의 링크 모음',
  description: '당신만의 특별한 링크 모음을 만들어보세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen bg-zinc-900`}>
        <nav className="bg-zinc-900 shadow-lg border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-white hover:text-zinc-200 transition-colors">모두트리</Link>
            <div className="flex gap-4 items-center">
              <Link 
                href="/login" 
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                로그인
              </Link>
              <Link 
                href="/signup" 
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                회원가입
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
} 