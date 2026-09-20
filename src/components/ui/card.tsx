import clsx from "clsx";

// Pannello "vetro" (.glass-panel, definita in globals.css): sfondo quasi
// trasparente + blur invece del vecchio bg-white pieno, così l'aurora
// animata dello sfondo resta visibile in trasparenza dietro ogni card
// dell'app — l'effetto "elemento di un ambiente digitale premium" invece
// di un rettangolo bianco appoggiato sulla pagina.
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
        "glass-panel animate-fade-in-up rounded-2xl shadow-ambient transition-all duration-300 ease-snappy",
        hoverable && "hover:-translate-y-1 hover:border-white/20 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
