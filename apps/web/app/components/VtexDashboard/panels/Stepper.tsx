import { STEP_LABELS, STEP_NUMBERS } from "../constants"
import { Status } from "../types"
import type { StepNumber, StepsState } from "../types"
import { StepBadge } from "../utils"

interface StepperProps {
  steps: StepsState
  enabled: Record<StepNumber, boolean>
}

const getLabelColor = (status: Status, isEnabled: boolean): string => {
  if (status === Status.Done) return "text-green-400"
  if (isEnabled) return "text-zinc-300"
  return "text-zinc-600"
}

export const Stepper = ({ steps, enabled }: StepperProps) => {
  const lastIndex = STEP_NUMBERS.length - 1

  return (
    <nav
      aria-label="Progreso del flujo"
      className="overflow-x-auto border-b border-zinc-800 bg-zinc-900/50 px-4 py-4 md:px-6 lg:px-8"
    >
      <ol className="mx-auto flex min-w-max max-w-7xl items-center md:min-w-0">
        {STEP_NUMBERS.map((step, index) => {
          const status = steps[step]
          const isLast = index === lastIndex
          const connectorColor =
            status === Status.Done ? "bg-green-500/50" : "bg-zinc-800"

          return (
            <li key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <StepBadge step={step} status={status} />
                <span
                  className={`whitespace-nowrap text-[10px] font-medium ${getLabelColor(
                    status,
                    enabled[step]
                  )}`}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={`mx-2 h-px flex-1 transition-colors duration-500 ${connectorColor}`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
