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
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-brand-600 to-accent-500" />
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        </div>
        {description && (
          <p className="mt-1 pl-4 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
