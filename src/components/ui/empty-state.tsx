import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex animate-fade-in-up flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white/70 px-6 py-16 text-center backdrop-blur-sm transition-colors duration-200 hover:border-accent-300">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600 shadow-glow">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
