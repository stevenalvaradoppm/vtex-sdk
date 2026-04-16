import type { OrderForm } from "@repo/sdk"
import type { StepCommonProps } from "../types"
import { ActionButton } from "../ui/ActionButton"
import { StepSection } from "../ui/StepSection"

interface CreateOrderFormStepProps extends StepCommonProps {
  createOrderForm: () => Promise<OrderForm>
  onOrderFormCreated: (orderForm: OrderForm) => void
}

const STEP_NUMBER = 2
const STEP_TITLE = "Crear carrito"
const STEP_DESCRIPTION = "Crea un nuevo orderForm (cart) en VTEX."

export const CreateOrderFormStep = ({
  status,
  enabled,
  loading,
  onRun,
  log,
  createOrderForm,
  onOrderFormCreated,
}: CreateOrderFormStepProps) => {
  const handleSubmit = () => {
    onRun(async () => {
      const created = await createOrderForm()
      onOrderFormCreated(created)
      log("success", `Order form creado: ${created.orderFormId}`, created)
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
      <ActionButton
        label="Crear carrito"
        onClick={handleSubmit}
        loading={loading}
      />
    </StepSection>
  )
}
