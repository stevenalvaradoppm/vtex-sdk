import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const BASE_INPUT_CLASSES =
  "rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none"
const VALID_INPUT_CLASSES =
  "border-zinc-700 focus:border-blue-500"
const INVALID_INPUT_CLASSES =
  "border-red-500/60 focus:border-red-500"

export const Input = ({ label, id, error, ...rest }: InputProps) => {
  const inputId = id ?? `input-${label.toLowerCase().replaceAll(/\s+/g, "-")}`
  const errorId = `${inputId}-error`
  const hasError = Boolean(error)
  const stateClasses = hasError ? INVALID_INPUT_CLASSES : VALID_INPUT_CLASSES

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </span>
      <input
        id={inputId}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        {...rest}
        className={`${BASE_INPUT_CLASSES} ${stateClasses}`}
      />
      {hasError && (
        <span id={errorId} role="alert" className="text-[11px] text-red-400">
          {error}
        </span>
      )}
    </label>
  )
}
