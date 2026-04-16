import { useMemo, useState, type ChangeEvent } from "react"
import type { StepCommonProps } from "../types"
import { ActionButton } from "../ui/ActionButton"
import { Input } from "../ui/Input"
import { StepSection } from "../ui/StepSection"
import { EMAIL_INVALID_MESSAGE, isValidEmail } from "../validation"

interface CreateSessionStepProps extends StepCommonProps {
  createSession: (email?: string) => Promise<void>
}

const STEP_NUMBER = 1
const STEP_TITLE = "Crear sesión"
const STEP_DESCRIPTION =
  "Inicializa la sesión VTEX. El email es opcional."

export const CreateSessionStep = ({
  status,
  enabled,
  loading,
  onRun,
  log,
  createSession,
}: CreateSessionStepProps) => {
  const [email, setEmail] = useState("")

  const emailError = useMemo(() => {
    if (email.length === 0) return undefined
    return isValidEmail(email) ? undefined : EMAIL_INVALID_MESSAGE
  }, [email])

  const isFormValid = email.length === 0 || emailError === undefined

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleSubmit = () => {
    onRun(async () => {
      await createSession(email || undefined)
      log("success", "Sesión creada correctamente")
    })
  }

  return (
    <StepSection
      step={STEP_NUMBER}
      title={STEP_TITLE}
      description={STEP_DESCRIPTION}
      status={status}
      enabled={enabled}
    >
      <Input
        label="Email (opcional)"
        type="email"
        placeholder="user@tienda.com"
        value={email}
        onChange={handleEmailChange}
        error={emailError}
      />
      <ActionButton
        label="Crear sesión"
        onClick={handleSubmit}
        loading={loading}
        disabled={!isFormValid}
      />
    </StepSection>
  )
}
