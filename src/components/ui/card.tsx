import clsx from "clsx";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-neutral-200 bg-white shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}
