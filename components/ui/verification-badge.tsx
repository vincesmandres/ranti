import { cn } from "@/lib/utils"

interface VerificationBadgeProps {
  verified?: boolean
  label?: string
  className?: string
}

export function VerificationBadge({ verified = false, label, className }: VerificationBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold",
        verified
          ? "bg-primary/10 text-primary border border-primary/30"
          : "bg-muted/10 text-muted-foreground border border-muted/30",
        className
      )}
    >
      {verified ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
        </svg>
      )}
      {label && <span>{label}</span>}
    </div>
  )
}
