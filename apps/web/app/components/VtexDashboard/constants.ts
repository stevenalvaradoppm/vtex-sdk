import type { StepNumber } from "./types"

export const TOTAL_STEPS = 6

export const STEP_NUMBERS: StepNumber[] = [1, 2, 3, 4, 5, 6]

export const STEP_LABELS: Record<StepNumber, string> = {
  1: "Crear sesión",
  2: "Crear carrito",
  3: "Obtener productos",
  4: "Añadir items",
  5: "Shipping data",
  6: "Client profile",
}

export const DEFAULT_SHIPPING_COUNTRY = "ECU"
export const DEFAULT_SHIPPING_SLA = "normal"
export const DEFAULT_SHIPPING_LAT = "-0.1807"
export const DEFAULT_SHIPPING_LNG = "-78.4678"
export const DEFAULT_ITEM_QTY = "1"
export const DEFAULT_ITEM_SELLER = "1"
export const DEFAULT_DOC_TYPE = "cedula"
