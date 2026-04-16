import type { ReactNode } from "react"
import type { Status, StepNumber } from "../types"
import { StepBadge, getStepBorderClasses } from "../utils"

interface StepSectionProps {
  step: StepNumber
  title: string
  description: string
  status: Status
  enabled: boolean
  children: ReactNode
}

export const StepSection = ({
  step,
  title,
  description,
  status,
  enabled,
  children,
}: StepSectionProps) => {
  const borderClasses = getStepBorderClasses(status, enabled)
  const pointerClasses = enabled ? "" : "pointer-events-none"

  return (
    <section
      aria-label={title}
      className={`rounded-2xl border p-5 transition-all duration-200 ${borderClasses} ${pointerClasses}`}
    >
      <header className="mb-4 flex items-center gap-3">
        <StepBadge step={step} status={status} />
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </header>
      {children}
    </section>
  )
}
