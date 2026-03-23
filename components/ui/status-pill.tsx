import { cn } from "@/lib/utils"

type StatusPillVariant = "active" | "pending" | "used" | "verified" | "error" | "default"

interface StatusPillProps {
  variant?: StatusPillVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<StatusPillVariant, string> = {
  active: "bg-primary/20 text-primary border-primary/40",
  pending: "bg-secondary/20 text-secondary border-secondary/40",
  used: "bg-muted/20 text-muted-foreground border-muted/40",
  verified: "bg-primary/20 text-primary border-primary/40",
  error: "bg-destructive/20 text-destructive border-destructive/40",
  default: "bg-surface-container-high text-on-surface-variant border-outline-variant",
}

export function StatusPill({ variant = "default", children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
