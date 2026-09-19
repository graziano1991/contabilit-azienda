import clsx from "clsx";

const TONE_CLASSES: Record<string, string> = {
  default: "bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200",
  success: "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  danger: "bg-red-50 text-cost ring-1 ring-inset ring-red-200",
  info: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200",
};

const DOT_CLASSES: Record<string, string> = {
  default: "bg-neutral-400",
  success: "bg-accent-500",
  warning: "bg-amber-500",
  danger: "bg-cost",
  info: "bg-brand-500",
};

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE_CLASSES;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone]
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", DOT_CLASSES[tone])} />
      {children}
    </span>
  );
}
