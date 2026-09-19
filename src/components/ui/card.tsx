import clsx from "clsx";

export function Card({
  children,
  className,
  hoverable = false,
}: {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-neutral-200/80 bg-white shadow-ambient transition-all duration-200 ease-snappy animate-fade-in-up",
        hoverable && "hover:-translate-y-1 hover:border-accent-200 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
