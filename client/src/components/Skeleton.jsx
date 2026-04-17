export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-700/60 ${className}`}
      aria-hidden
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-700 bg-navy-light p-6">
      <Skeleton className="mb-4 h-4 w-1/3" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-700/80">
      <td className="py-3">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-3">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="py-3">
        <Skeleton className="h-4 w-16" />
      </td>
    </tr>
  );
}
