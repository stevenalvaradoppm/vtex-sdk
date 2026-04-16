import type {
  AddItemInput,
  ShippingDataInput,
  ClientProfileDataInput,
  OrderForm,
} from "@repo/sdk"

export enum Status {
  Idle = "idle",
  Loading = "loading",
  Done = "done",
  Error = "error",
}

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6

export type StepsState = Record<StepNumber, Status>

export type LogType = "info" | "success" | "error"

export interface LogEntry {
  ts: string
  type: LogType
  msg: string
  data?: unknown
}

export interface DashboardActions {
  createSession: (email?: string) => Promise<void>
  createOrderForm: () => Promise<OrderForm>
  getProducts: () => Promise<unknown>
  addItem: (id: string, items: AddItemInput[]) => Promise<OrderForm>
  setShipping: (id: string, data: ShippingDataInput) => Promise<OrderForm>
  setClientProfile: (
    id: string,
    data: ClientProfileDataInput
  ) => Promise<OrderForm>
}

export type LogFn = (type: LogType, msg: string, data?: unknown) => void

export type RunFn = (
  step: StepNumber,
  fn: () => Promise<void>
) => void

export interface StepCommonProps {
  status: Status
  enabled: boolean
  loading: boolean
  onRun: (fn: () => Promise<void>) => void
  log: LogFn
}
