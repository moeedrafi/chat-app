"use client";
import { twMerge } from "tailwind-merge";
import { LoaderIcon } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
}

export const Button = ({
  variant = "primary",
  children,
  className,
  loading,
  icon,
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: "bg-primary hover:bg-primary/80",
    secondary: "bg-secondary hover:bg-secondary/80",
    ghost:
      "bg-dark text-muted-foreground border-color hover:bg-bg hover:text-text",
    destructive: "bg-rose-600 hover:bg-rose-500",
    outline: "border-color bg-dark hover:bg-bg text-muted-foreground",
  }[variant];

  return (
    <button
      {...props}
      className={twMerge(
        "flex items-center border border-transparent justify-center gap-2 text-white dark:text-black py-2 px-4 whitespace-nowrap rounded-md transition duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed",
        variantClasses,
        className,
      )}
    >
      {icon}
      {loading ? <LoaderIcon className="animate-spin" /> : children}
    </button>
  );
};
