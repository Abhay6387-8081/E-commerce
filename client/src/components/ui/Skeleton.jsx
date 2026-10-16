function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-ink-300/40 rounded ${className}`} />;
}

export function SkeletonProductCard() {
  return (
    <div className="rounded-card border border-ink-300/50 p-3">
      <Skeleton className="w-full aspect-square mb-3 rounded-lg" />
      <Skeleton className="h-3 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-8 w-full rounded-full" />
    </div>
  );
}

export default Skeleton;