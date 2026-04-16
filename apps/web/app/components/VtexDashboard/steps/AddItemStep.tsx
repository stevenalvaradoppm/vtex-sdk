import { useState, type ChangeEvent } from "react"
import type { AddItemInput, OrderForm } from "@repo/sdk"
import { DEFAULT_ITEM_QTY, DEFAULT_ITEM_SELLER } from "../constants"
import type { StepCommonProps } from "../types"
import { ActionButton } from "../ui/ActionButton"
import { Input } from "../ui/Input"
import { StepSection } from "../ui/StepSection"

interface AddItemStepProps extends StepCommonProps {
  orderFormId: string
  addItem: (id: string, items: AddItemInput[]) => Promise<OrderForm>
  onOrderFormUpdated: (orderForm: OrderForm) => void
}

const STEP_NUMBER = 4
const STEP_TITLE = "Añadir items"
const STEP_DESCRIPTION = "Agrega un SKU al carrito por su ID."

export const AddItemStep = ({
  status,
  enabled,
  loading,
  onRun,
  log,
  orderFormId,
  addItem,
  onOrderFormUpdated,
}: AddItemStepProps) => {
  const [itemId, setItemId] = useState("")
  const [itemQty, setItemQty] = useState(DEFAULT_ITEM_QTY)
  const [itemSeller, setItemSeller] = useState(DEFAULT_ITEM_SELLER)

  const handleItemIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setItemId(event.target.value)
  }

  const handleQtyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setItemQty(event.target.value)
  }

  const handleSellerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setItemSeller(event.target.value)
  }

  const handleSubmit = () => {
    onRun(async () => {
      const updated = await addItem(orderFormId, [
        { id: itemId, quantity: Number(itemQty), seller: itemSeller },
      ])
      onOrderFormUpdated(updated)
      log(
        "success",
        `Item ${itemId} añadido (${updated.items.length} item/s)`,
        updated
      )
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          label="SKU ID"
          placeholder="ej. 880011"
          value={itemId}
          onChange={handleItemIdChange}
        />
        <Input
          label="Cantidad"
          type="number"
          min="1"
          value={itemQty}
          onChange={handleQtyChange}
        />
        <Input
          label="Seller"
          placeholder="1"
          value={itemSeller}
          onChange={handleSellerChange}
        />
      </div>
      <ActionButton
        label="Añadir item"
        onClick={handleSubmit}
        loading={loading}
        disabled={!itemId}
      />
    </StepSection>
  )
}
