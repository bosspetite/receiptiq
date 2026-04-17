export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 bg-navy-light/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl text-accent">
        📄
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
