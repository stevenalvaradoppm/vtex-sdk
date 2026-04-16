import { Status } from "./types"

const BADGE_BASE =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"

interface StepBadgeProps {
  step: number
  status: Status
}

export const StepBadge = ({ step, status }: StepBadgeProps) => {
  if (status === Status.Loading) {
    return (
      <span
        aria-label="Procesando"
        className={`${BADGE_BASE} border-2 border-blue-500 border-t-transparent animate-spin`}
      />
    )
  }

  if (status === Status.Done) {
    return (
      <span aria-label="Completado" className={`${BADGE_BASE} bg-green-500 text-white`}>
        ✓
      </span>
    )
  }

  if (status === Status.Error) {
    return (
      <span aria-label="Error" className={`${BADGE_BASE} bg-red-500 text-white`}>
        ✗
      </span>
    )
  }

  return (
    <span className={`${BADGE_BASE} bg-zinc-700 text-zinc-300`}>{step}</span>
  )
}

export const getStepBorderClasses = (
  status: Status,
  enabled: boolean
): string => {
  if (!enabled) return "border-zinc-800 opacity-40"
  if (status === Status.Loading)
    return "border-blue-500 shadow-[0_0_0_1px_rgb(59,130,246,0.3)]"
  if (status === Status.Done) return "border-green-500/40 bg-green-500/[0.04]"
  if (status === Status.Error) return "border-red-500/40 bg-red-500/[0.04]"
  return "border-zinc-800 hover:border-zinc-700"
}
