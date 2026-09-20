export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex animate-fade-in-up items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-7 w-1.5 rounded-full bg-premium-gradient shadow-glow" />
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>
        </div>
        {description && (
          <p className="mt-1.5 pl-4 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
