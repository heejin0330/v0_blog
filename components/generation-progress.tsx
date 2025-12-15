"use client"

import { cn } from "@/lib/utils"
import { Check, Loader2 } from "lucide-react"

type StepStatus = "pending" | "active" | "completed" | "error"

interface Step {
  id: string
  label: string
  status: StepStatus
}

interface GenerationProgressProps {
  steps: Step[]
  currentStep: string
}

export function GenerationProgress({ steps, currentStep }: GenerationProgressProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-3">
          {/* Step Indicator */}
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
              step.status === "completed" && "border-green-500 bg-green-500 text-white",
              step.status === "active" && "border-accent bg-accent/10 text-accent",
              step.status === "pending" && "border-border bg-muted text-muted-foreground",
              step.status === "error" && "border-destructive bg-destructive/10 text-destructive",
            )}
          >
            {step.status === "completed" ? (
              <Check className="h-4 w-4" />
            ) : step.status === "active" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              index + 1
            )}
          </div>

          {/* Step Label */}
          <span
            className={cn(
              "text-sm transition-colors",
              step.status === "completed" && "text-foreground",
              step.status === "active" && "font-medium text-foreground",
              step.status === "pending" && "text-muted-foreground",
              step.status === "error" && "text-destructive",
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}
