interface ActionButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

const LOADING_LABEL = "Cargando…"

const Spinner = () => (
  <span
    aria-hidden="true"
    className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white"
  />
)

export const ActionButton = ({
  label,
  onClick,
  disabled = false,
  loading = false,
}: ActionButtonProps) => {
  const handleClick = () => {
    if (disabled || loading) return
    onClick()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={label}
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {loading && <Spinner />}
      <span>{loading ? LOADING_LABEL : label}</span>
    </button>
  )
}
