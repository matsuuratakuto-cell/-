import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type ButtonColor = "teal" | "indigo" | "rose" | "amber" | "white";

const COLOR_STYLES: Record<ButtonColor, string> = {
  teal: "bg-brand-600 text-white shadow-[0_4px_0_0_#253763] active:shadow-[0_0px_0_0_#253763] hover:bg-brand-500",
  indigo:
    "bg-brand-600 text-white shadow-[0_4px_0_0_#253763] active:shadow-[0_0px_0_0_#253763] hover:bg-brand-500",
  rose: "bg-rose-500 text-white shadow-[0_4px_0_0_#9f1239] active:shadow-[0_0px_0_0_#9f1239] hover:bg-rose-400",
  amber:
    "bg-amber-400 text-stone-900 shadow-[0_4px_0_0_#b45309] active:shadow-[0_0px_0_0_#b45309] hover:bg-amber-300",
  white:
    "bg-white text-stone-700 shadow-[0_4px_0_0_#d6d3d1] active:shadow-[0_0px_0_0_#d6d3d1] hover:bg-stone-50",
};

const SIZE_STYLES = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const BASE =
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl font-bold transition-all duration-100 active:translate-y-1 disabled:pointer-events-none disabled:opacity-40 disabled:active:translate-y-0";

interface CommonProps {
  color?: ButtonColor;
  size?: keyof typeof SIZE_STYLES;
  className?: string;
}

export function Button({
  color = "teal",
  size = "md",
  className = "",
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${BASE} ${COLOR_STYLES[color]} ${SIZE_STYLES[size]} ${className}`}
      {...props}
    />
  );
}

export function LinkButton({
  color = "teal",
  size = "md",
  className = "",
  href,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      className={`${BASE} ${COLOR_STYLES[color]} ${SIZE_STYLES[size]} ${className}`}
      {...props}
    />
  );
}
