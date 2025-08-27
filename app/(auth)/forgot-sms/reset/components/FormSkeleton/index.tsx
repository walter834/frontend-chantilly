const FormSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
    <div className="w-full max-w-md backdrop-blur-sm rounded-2xl p-8 shadow-2xl border bg-white">
      {/* Header skeleton */}
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-700 to-red-600 rounded-full flex items-center justify-center shadow-lg mb-4">
          <span className="text-white text-2xl">🔒</span>
        </div>
        <div className="h-7 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
      </div>

      {/* Success message skeleton */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="h-4 bg-green-200 rounded w-48 animate-pulse"></div>
        </div>
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-11 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div>
          <div className="h-4 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
          <div className="h-11 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Requirements skeleton */}
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-14 bg-gradient-to-r from-red-700 to-red-600 rounded-xl animate-pulse"></div>
      </div>

      {/* Footer links skeleton */}
      <div className="text-center mt-6">
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
      </div>

      <div className="mt-4 text-center">
        <div className="h-3 bg-gray-200 rounded w-56 mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default FormSkeleton;