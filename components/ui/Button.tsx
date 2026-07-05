import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  className?: string;
};

const base =
  "inline-flex items-center justify-center rounded-full px-7 py-3 font-heading font-semibold tracking-tight transition-all duration-300 cursor-pointer";

const variants = {
  primary:
    "bg-accent text-bg hover:scale-[1.04] hover:shadow-[0_0_32px_rgba(74,158,255,0.5)]",
  ghost:
    "border border-accent/30 text-text hover:border-accent/80 hover:shadow-[0_0_24px_rgba(74,158,255,0.25)]",
};

/** Bouton maison : rendu <a> si href est fourni, sinon <button>. */
export default function Button({
  children,
  href,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
