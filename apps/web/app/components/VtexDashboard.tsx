"use client"

import { useCallback, useState } from "react"
import type { OrderForm } from "@repo/sdk"
import { useActivityLog } from "./VtexDashboard/hooks/useActivityLog"
import { useStepRunner } from "./VtexDashboard/hooks/useStepRunner"
import { ActivityLogPanel } from "./VtexDashboard/panels/ActivityLogPanel"
import { DashboardHeader } from "./VtexDashboard/panels/DashboardHeader"
import { OrderFormPanel } from "./VtexDashboard/panels/OrderFormPanel"
import { Stepper } from "./VtexDashboard/panels/Stepper"
import { AddItemStep } from "./VtexDashboard/steps/AddItemStep"
import { ClientProfileStep } from "./VtexDashboard/steps/ClientProfileStep"
import { CreateOrderFormStep } from "./VtexDashboard/steps/CreateOrderFormStep"
import { CreateSessionStep } from "./VtexDashboard/steps/CreateSessionStep"
import { GetProductsStep } from "./VtexDashboard/steps/GetProductsStep"
import { ShippingStep } from "./VtexDashboard/steps/ShippingStep"
import type { DashboardActions } from "./VtexDashboard/types"

const UNKNOWN_ERROR_MESSAGE = "Error desconocido"

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  return UNKNOWN_ERROR_MESSAGE
}

const VtexDashboard = (props: DashboardActions) => {
  const [orderFormId, setOrderFormId] = useState("")
  const [orderForm, setOrderForm] = useState<OrderForm | null>(null)

  const { logs, log, clearLogs } = useActivityLog()

  const handleStepError = useCallback(
    (error: unknown) => {
      log("error", getErrorMessage(error))
    },
    [log]
  )

  const { steps, enabled, isStepLoading, run } = useStepRunner({
    onError: handleStepError,
  })

  const handleOrderFormCreated = useCallback((created: OrderForm) => {
    setOrderFormId(created.orderFormId)
    setOrderForm(created)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 font-[family-name:var(--font-geist-sans)]">
      <DashboardHeader orderFormId={orderFormId} />
      <Stepper steps={steps} enabled={enabled} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-5 lg:p-8">
        <div className="flex flex-col gap-4 lg:col-span-3">
          <CreateSessionStep
            status={steps[1]}
            enabled={enabled[1]}
            loading={isStepLoading(1)}
            onRun={(fn) => run(1, fn)}
            log={log}
            createSession={props.createSession}
          />
          <CreateOrderFormStep
            status={steps[2]}
            enabled={enabled[2]}
            loading={isStepLoading(2)}
            onRun={(fn) => run(2, fn)}
            log={log}
            createOrderForm={props.createOrderForm}
            onOrderFormCreated={handleOrderFormCreated}
          />
          <GetProductsStep
            status={steps[3]}
            enabled={enabled[3]}
            loading={isStepLoading(3)}
            onRun={(fn) => run(3, fn)}
            log={log}
            getProducts={props.getProducts}
          />
          <AddItemStep
            status={steps[4]}
            enabled={enabled[4]}
            loading={isStepLoading(4)}
            onRun={(fn) => run(4, fn)}
            log={log}
            orderFormId={orderFormId}
            addItem={props.addItem}
            onOrderFormUpdated={setOrderForm}
          />
          <ShippingStep
            status={steps[5]}
            enabled={enabled[5]}
            loading={isStepLoading(5)}
            onRun={(fn) => run(5, fn)}
            log={log}
            orderFormId={orderFormId}
            setShipping={props.setShipping}
            onOrderFormUpdated={setOrderForm}
          />
          <ClientProfileStep
            status={steps[6]}
            enabled={enabled[6]}
            loading={isStepLoading(6)}
            onRun={(fn) => run(6, fn)}
            log={log}
            orderFormId={orderFormId}
            setClientProfile={props.setClientProfile}
            onOrderFormUpdated={setOrderForm}
          />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:col-span-2 lg:self-start">
          <OrderFormPanel orderForm={orderForm} />
          <ActivityLogPanel logs={logs} onClear={clearLogs} />
        </aside>
      </div>
    </div>
  )
}

export default VtexDashboard
