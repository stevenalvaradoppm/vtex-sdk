import { useMemo, useState, type ChangeEvent } from "react"
import type { ClientProfileDataInput, OrderForm } from "@repo/sdk"
import { DEFAULT_DOC_TYPE } from "../constants"
import type { StepCommonProps } from "../types"
import { ActionButton } from "../ui/ActionButton"
import { Input } from "../ui/Input"
import { StepSection } from "../ui/StepSection"
import { EMAIL_INVALID_MESSAGE, isValidEmail } from "../validation"

interface ClientProfileStepProps extends StepCommonProps {
  orderFormId: string
  setClientProfile: (
    id: string,
    data: ClientProfileDataInput
  ) => Promise<OrderForm>
  onOrderFormUpdated: (orderForm: OrderForm) => void
}

const STEP_NUMBER = 6
const STEP_TITLE = "Attach client profile"
const STEP_DESCRIPTION = "Adjunta los datos de identidad del cliente."

type ProfileForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  document: string
  documentType: string
}

const INITIAL_FORM: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  document: "",
  documentType: DEFAULT_DOC_TYPE,
}

const isProfileFormComplete = (form: ProfileForm): boolean =>
  Object.values(form).every((value) => value.trim().length > 0)

const getEmailError = (email: string): string | undefined => {
  if (email.length === 0) return undefined
  return isValidEmail(email) ? undefined : EMAIL_INVALID_MESSAGE
}

export const ClientProfileStep = ({
  status,
  enabled,
  loading,
  onRun,
  log,
  orderFormId,
  setClientProfile,
  onOrderFormUpdated,
}: ClientProfileStepProps) => {
  const [form, setForm] = useState<ProfileForm>(INITIAL_FORM)

  const emailError = useMemo(() => getEmailError(form.email), [form.email])

  const isFormValid = useMemo(
    () => isProfileFormComplete(form) && emailError === undefined,
    [form, emailError]
  )

  const handleFieldChange =
    (field: keyof ProfileForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleSubmit = () => {
    onRun(async () => {
      const updated = await setClientProfile(orderFormId, {
        document: form.document,
        documentType: form.documentType,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        homePhone: form.phone,
      })
      onOrderFormUpdated(updated)
      log("success", "Client profile adjuntado", updated)
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Nombre"
          placeholder="Test"
          value={form.firstName}
          onChange={handleFieldChange("firstName")}
        />
        <Input
          label="Apellido"
          placeholder="User"
          value={form.lastName}
          onChange={handleFieldChange("lastName")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="test@test.com"
          value={form.email}
          onChange={handleFieldChange("email")}
          error={emailError}
        />
        <Input
          label="Teléfono"
          placeholder="+5930000000000"
          value={form.phone}
          onChange={handleFieldChange("phone")}
        />
        <Input
          label="Documento"
          placeholder="0000000000"
          value={form.document}
          onChange={handleFieldChange("document")}
        />
        <Input
          label="Tipo doc."
          placeholder={DEFAULT_DOC_TYPE}
          value={form.documentType}
          onChange={handleFieldChange("documentType")}
        />
      </div>
      <ActionButton
        label="Adjuntar perfil"
        onClick={handleSubmit}
        loading={loading}
        disabled={!isFormValid}
      />
    </StepSection>
  )
}
