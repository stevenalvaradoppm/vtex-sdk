import { useState } from "react"
import { Status } from "../types"
import type { StepCommonProps } from "../types"
import { ActionButton } from "../ui/ActionButton"
import { StepSection } from "../ui/StepSection"

interface GetProductsStepProps extends StepCommonProps {
  getProducts: () => Promise<unknown>
}

const STEP_NUMBER = 3
const STEP_TITLE = "Obtener productos"
const STEP_DESCRIPTION = "Consulta el catálogo vía Intelligent Search."

export const GetProductsStep = ({
  status,
  enabled,
  loading,
  onRun,
  log,
  getProducts,
}: GetProductsStepProps) => {
  const [products, setProducts] = useState<unknown>(null)

  const handleSubmit = () => {
    onRun(async () => {
      const data = await getProducts()
      setProducts(data)
      log("success", "Productos obtenidos", data)
    })
  }

  const showProducts = status === Status.Done && products != null

  return (
    <StepSection
      step={STEP_NUMBER}
      title={STEP_TITLE}
      description={STEP_DESCRIPTION}
      status={status}
      enabled={enabled}
    >
      {showProducts && (
        <pre className="mb-3 max-h-40 overflow-auto rounded-lg bg-zinc-800 p-3 font-[family-name:var(--font-geist-mono)] text-[11px] text-zinc-300">
          {JSON.stringify(products, null, 2)}
        </pre>
      )}
      <ActionButton
        label="Obtener productos"
        onClick={handleSubmit}
        loading={loading}
      />
    </StepSection>
  )
}
