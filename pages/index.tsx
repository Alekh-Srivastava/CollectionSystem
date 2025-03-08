import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to Collections Management</h2>
        <p className="text-gray-600 mb-4">
          This application allows you to create and manage product collections. 
          New collections will go through a review process before being published.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Create Collections</h3>
            <p className="text-gray-600 mb-4">
              Create new collections by selecting products from the catalog.
              All new collections will be submitted for review.
            </p>
            <Link 
              href="/collections/create" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Collection
            </Link>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">View Collections</h3>
            <p className="text-gray-600 mb-4">
              Browse and manage existing collections or check the status of collections under review.
            </p>
            <div className="space-x-4">
              <Link 
                href="/collections" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                View Collections
              </Link>
              <Link 
                href="/collections/review" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Review Queue
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Browse the <Link href="/products" className="text-blue-600 hover:underline">product catalog</Link> to see available products</li>
          <li>Create a new collection by selecting products and providing collection details</li>
          <li>Submit the collection for review</li>
          <li>Check the review queue to see the status of your submitted collections</li>
          <li>Once approved, collections will appear in the main collections list</li>
        </ol>
      </div>
    </div>
  );
}
