import type { OrderForm } from "@repo/sdk"

interface OrderFormPanelProps {
  orderForm: OrderForm | null
}

export const OrderFormPanel = ({ orderForm }: OrderFormPanelProps) => {
  if (!orderForm) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-3 text-sm font-semibold">Order Form</h2>
        <p className="text-xs text-zinc-600">
          Aún no hay datos. Completa el flujo.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="mb-3 text-sm font-semibold">Order Form</h2>
      <pre className="max-h-64 overflow-auto rounded-lg bg-zinc-800 p-3 font-[family-name:var(--font-geist-mono)] text-[11px] text-zinc-300">
        {JSON.stringify(orderForm, null, 2)}
      </pre>
    </div>
  )
}
