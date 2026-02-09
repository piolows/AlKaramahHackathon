export default function ClassesLoading() {
  return (
    <div className="min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-6" />

        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-5 w-72 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-primary-100 rounded-lg animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-primary-100 rounded-lg animate-pulse" />
                <div>
                  <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
