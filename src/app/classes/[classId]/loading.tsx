export default function ClassDetailLoading() {
  return (
    <div className="min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mb-6" />

        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Tab bar skeleton */}
        <div className="flex gap-2 mb-6">
          {['Students', 'Lessons', 'Visual Schedule'].map((label) => (
            <div key={label} className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
