import Link from 'next/link'
import { Wallet } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex h-16 items-center border-b border-border/60 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <span className="font-700 tracking-tight">Finança</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
