import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Collection Manager</h1>
              <nav className="space-x-6">
                <Link href="/" className="text-sm font-medium text-cyan-100 hover:text-cyan-400 transition-colors">Home</Link>
                <Link href="/collections" className="text-sm font-medium text-cyan-100 hover:text-cyan-400 transition-colors">Collections</Link>
                <Link href="/products" className="text-sm font-medium text-cyan-100 hover:text-cyan-400 transition-colors">Products</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
