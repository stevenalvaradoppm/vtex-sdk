import { useMemo, useState, type ChangeEvent } from "react"
import type { OrderForm, ShippingDataInput } from "@repo/sdk"
import {
  DEFAULT_SHIPPING_COUNTRY,
  DEFAULT_SHIPPING_LAT,
  DEFAULT_SHIPPING_LNG,
  DEFAULT_SHIPPING_SLA,
} from "../constants"
import type { StepCommonProps } from "../types"
import { ActionButton } from "../ui/ActionButton"
import { Input } from "../ui/Input"
import { StepSection } from "../ui/StepSection"

interface ShippingStepProps extends StepCommonProps {
  orderFormId: string
  setShipping: (id: string, data: ShippingDataInput) => Promise<OrderForm>
  onOrderFormUpdated: (orderForm: OrderForm) => void
}

const STEP_NUMBER = 5
const STEP_TITLE = "Attach shipping data"
const STEP_DESCRIPTION = "Adjunta la dirección y opciones de envío."
const ADDRESS_NAME = "home"
const ADDRESS_TYPE = "residential"
const DELIVERY_CHANNEL = "delivery"
const DEFAULT_ITEM_INDEX = 0

type ShippingForm = {
  receiver: string
  city: string
  street: string
  number: string
  complement: string
  country: string
  sla: string
  lat: string
  lng: string
}

const INITIAL_FORM: ShippingForm = {
  receiver: "",
  city: "",
  street: "",
  number: "",
  complement: "",
  country: DEFAULT_SHIPPING_COUNTRY,
  sla: DEFAULT_SHIPPING_SLA,
  lat: DEFAULT_SHIPPING_LAT,
  lng: DEFAULT_SHIPPING_LNG,
}

const getGeoCoordinates = (lat: string, lng: string): number[] => {
  if (!lat || !lng) return []
  return [Number.parseFloat(lng), Number.parseFloat(lat)]
}

const isShippingFormComplete = (form: ShippingForm): boolean =>
  Object.values(form).every((value) => value.trim().length > 0)

export const ShippingStep = ({
  status,
  enabled,
  loading,
  onRun,
  log,
  orderFormId,
  setShipping,
  onOrderFormUpdated,
}: ShippingStepProps) => {
  const [form, setForm] = useState<ShippingForm>(INITIAL_FORM)

  const isFormValid = useMemo(() => isShippingFormComplete(form), [form])

  const handleFieldChange =
    (field: keyof ShippingForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleSubmit = () => {
    onRun(async () => {
      const updated = await setShipping(orderFormId, {
        clearAddressIfPostalCodeNotFound: false,
        logisticsInfo: {
          itemIndex: DEFAULT_ITEM_INDEX,
          selectedDeliveryChannel: DELIVERY_CHANNEL,
          selectedSla: form.sla,
        },
        selectedAddresses: [
          {
            addressName: ADDRESS_NAME,
            addressType: ADDRESS_TYPE,
            city: form.city,
            country: form.country,
            geoCoordinates: getGeoCoordinates(form.lat, form.lng),
            number: form.number,
            receiverName: form.receiver,
            street: form.street,
            complement: form.complement,
          },
        ],
      })
      onOrderFormUpdated(updated)
      log("success", "Shipping data adjuntado", updated)
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
          label="Receptor"
          placeholder="Test User"
          value={form.receiver}
          onChange={handleFieldChange("receiver")}
        />
        <Input
          label="País"
          placeholder={DEFAULT_SHIPPING_COUNTRY}
          value={form.country}
          onChange={handleFieldChange("country")}
        />
        <Input
          label="Ciudad"
          placeholder="Quito"
          value={form.city}
          onChange={handleFieldChange("city")}
        />
        <Input
          label="Calle"
          placeholder="Av. Example"
          value={form.street}
          onChange={handleFieldChange("street")}
        />
        <Input
          label="Número"
          placeholder="123"
          value={form.number}
          onChange={handleFieldChange("number")}
        />
        <Input
          label="SLA"
          placeholder={DEFAULT_SHIPPING_SLA}
          value={form.sla}
          onChange={handleFieldChange("sla")}
        />
        <Input
          label="Complemento"
          placeholder="Apto 101"
          value={form.complement}
          onChange={handleFieldChange("complement")}
        />
        <Input
          label="Lat"
          placeholder={DEFAULT_SHIPPING_LAT}
          value={form.lat}
          onChange={handleFieldChange("lat")}
        />
        <Input
          label="Lng"
          placeholder={DEFAULT_SHIPPING_LNG}
          value={form.lng}
          onChange={handleFieldChange("lng")}
        />
      </div>
      <ActionButton
        label="Adjuntar shipping"
        onClick={handleSubmit}
        loading={loading}
        disabled={!isFormValid}
      />
    </StepSection>
  )
}
