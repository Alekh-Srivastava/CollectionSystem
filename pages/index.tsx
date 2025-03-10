import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10 w-full max-w-4xl">
        <div className="mb-10 pb-6 border-b border-white/20">
          <h1 className="text-3xl font-bold text-white">Welcome to Collection Manager</h1>
          <div className="mt-2 w-16 h-1 bg-cyan-400 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/collections" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-cyan-100 mb-2">Collections</h2>
            <p className="text-sm text-cyan-300/80">Manage and view all collections</p>
          </Link>
          <Link href="/collections/create" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-cyan-100 mb-2">Create Collection</h2>
            <p className="text-sm text-cyan-300/80">Start a new collection</p>
          </Link>
          <Link href="/collections/review" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-cyan-100 mb-2">Review Queue</h2>
            <p className="text-sm text-cyan-300/80">Approve or reject collections</p>
          </Link>
          <Link href="/products" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-cyan-100 mb-2">Products</h2>
            <p className="text-sm text-cyan-300/80">Manage available products</p>
          </Link>
        </div>
      </div>
    </div>
  );
}