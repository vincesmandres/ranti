'use client'

import { cn } from "@/lib/utils"

interface Step {
  label: string
  completed?: boolean
  active?: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep?: number
  className?: string
}

export function StepIndicator({ steps, currentStep = 0, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = step.completed ?? index < currentStep
        const isActive = step.active ?? index === currentStep

        return (
          <div key={index} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-primary/20 text-primary border border-primary"
                    : "bg-surface-container-high text-muted-foreground border border-outline-variant"
                )}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-px",
                  isCompleted ? "bg-primary" : "bg-outline-variant"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
