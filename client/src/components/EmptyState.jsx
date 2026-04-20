import { Inbox } from "lucide-react";

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-slate-300">
        <Inbox size={20} strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-7 text-slate-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
