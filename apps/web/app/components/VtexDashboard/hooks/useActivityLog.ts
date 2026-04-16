import { useCallback, useState } from "react"
import type { LogEntry, LogFn, LogType } from "../types"

interface UseActivityLogResult {
  logs: LogEntry[]
  log: LogFn
  clearLogs: () => void
}

export const useActivityLog = (): UseActivityLogResult => {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const log = useCallback<LogFn>((type: LogType, msg, data) => {
    setLogs((prev) => [
      { ts: new Date().toLocaleTimeString(), type, msg, data },
      ...prev,
    ])
  }, [])

  const clearLogs = useCallback(() => setLogs([]), [])

  return { logs, log, clearLogs }
}
