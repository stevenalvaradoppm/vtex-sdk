import type { LogEntry, LogType } from "../types"

interface ActivityLogPanelProps {
  logs: LogEntry[]
  onClear: () => void
}

const TYPE_ICON: Record<LogType, string> = {
  success: "✓",
  error: "✗",
  info: "→",
}

const getEntryClasses = (type: LogType): string => {
  if (type === "success") {
    return "border-green-500/20 bg-green-500/5 text-green-400"
  }
  if (type === "error") {
    return "border-red-500/20 bg-red-500/5 text-red-400"
  }
  return "border-zinc-700 text-zinc-400"
}

export const ActivityLogPanel = ({
  logs,
  onClear,
}: ActivityLogPanelProps) => {
  const hasLogs = logs.length > 0

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Activity Log</h2>
        {hasLogs && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpiar actividad"
            className="text-[10px] text-zinc-600 hover:text-zinc-400"
          >
            Limpiar
          </button>
        )}
      </div>
      {!hasLogs && (
        <p className="text-xs text-zinc-600">
          Sin actividad. Ejecuta el flujo paso a paso.
        </p>
      )}
      {hasLogs && (
        <ul className="flex max-h-96 flex-col gap-2 overflow-y-auto">
          {logs.map((entry, index) => (
            <li
              key={`${entry.ts}-${index}`}
              className={`rounded-lg border px-3 py-2 text-xs ${getEntryClasses(
                entry.type
              )}`}
            >
              <div className="flex items-center gap-2">
                <span className="shrink-0 font-bold">
                  {TYPE_ICON[entry.type]}
                </span>
                <span className="text-zinc-600">{entry.ts}</span>
                <span>{entry.msg}</span>
              </div>
              {entry.data != null && (
                <pre className="mt-1.5 max-h-28 overflow-auto rounded bg-zinc-800 p-2 font-[family-name:var(--font-geist-mono)] text-[10px] text-zinc-400">
                  {JSON.stringify(entry.data, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
