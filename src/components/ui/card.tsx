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
        "rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-200",
        hoverable && "hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
