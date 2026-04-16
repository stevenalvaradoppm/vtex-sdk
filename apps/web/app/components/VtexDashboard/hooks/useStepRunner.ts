import { useCallback, useMemo, useState } from "react"
import { Status } from "../types"
import type { RunFn, StepNumber, StepsState } from "../types"

const INITIAL_STEPS: StepsState = {
  1: Status.Idle,
  2: Status.Idle,
  3: Status.Idle,
  4: Status.Idle,
  5: Status.Idle,
  6: Status.Idle,
}

interface UseStepRunnerOptions {
  onError?: (error: unknown) => void
}

interface UseStepRunnerResult {
  steps: StepsState
  enabled: Record<StepNumber, boolean>
  isStepLoading: (step: StepNumber) => boolean
  run: RunFn
}

export const useStepRunner = (
  options: UseStepRunnerOptions = {}
): UseStepRunnerResult => {
  const { onError } = options
  const [steps, setSteps] = useState<StepsState>(INITIAL_STEPS)

  const updateStepStatus = useCallback(
    (step: StepNumber, status: StepsState[StepNumber]) => {
      setSteps((prev) => ({ ...prev, [step]: status }))
    },
    []
  )

  const run = useCallback<RunFn>(
    (step, fn) => {
      const execute = async () => {
        updateStepStatus(step, Status.Loading)
        try {
          await fn()
          updateStepStatus(step, Status.Done)
        } catch (error) {
          updateStepStatus(step, Status.Error)
          onError?.(error)
        }
      }
      void execute()
    },
    [updateStepStatus, onError]
  )

  const enabled = useMemo<Record<StepNumber, boolean>>(
    () => ({
      1: true,
      2: steps[1] === Status.Done,
      3: steps[2] === Status.Done,
      4: steps[3] === Status.Done,
      5: steps[4] === Status.Done,
      6: steps[5] === Status.Done,
    }),
    [steps]
  )

  const isStepLoading = useCallback(
    (step: StepNumber) => steps[step] === Status.Loading,
    [steps]
  )

  return { steps, enabled, isStepLoading, run }
}
