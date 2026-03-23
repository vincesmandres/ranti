import { cn } from "@/lib/utils"
import Link from "next/link"

interface ActionCTAProps {
  href?: string
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  disabled?: boolean
  loading?: boolean
  className?: string
  children: React.ReactNode
}

const variantStyles = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  outline: "border border-primary text-primary hover:bg-primary/10",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-surface-container-high",
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
}

export function ActionCTA({
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  disabled,
  loading,
  className,
  children,
}: ActionCTAProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all",
    variantStyles[variant],
    sizeStyles[size],
    (disabled || loading) && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  )

  const content = (
    <>
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </>
  )

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={baseStyles}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} disabled={disabled || loading} className={baseStyles}>
      {content}
    </button>
  )
}
