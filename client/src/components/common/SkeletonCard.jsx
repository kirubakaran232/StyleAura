// Skeleton card for blog posts masonry grid
export function SkeletonCard({ tall = false }) {
  return (
    <div className={`masonry-item card ${tall ? 'h-80' : 'h-56'}`}>
      <div className={`skeleton w-full ${tall ? 'h-56' : 'h-36'}`} />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

// Skeleton for product cards
export function SkeletonProductCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton w-full h-48 rounded-xl" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  );
}

// Skeleton row for admin table
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-neutral-800">
      <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
      <div className="skeleton h-8 w-20 rounded-lg" />
    </div>
  );
}
