interface DashboardHeaderProps {
  orderFormId: string
}

export const DashboardHeader = ({ orderFormId }: DashboardHeaderProps) => {
  const hasOrderForm = orderFormId.length > 0

  return (
    <header className="border-b border-zinc-800 px-4 py-4 md:px-6 lg:px-8 lg:py-5">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            VTEX SDK ADMIN
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            Server Actions ·{" "}
            <code className="font-[family-name:var(--font-geist-mono)]">
              @repo/sdk
            </code>
          </p>
        </div>
        {hasOrderForm && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs">
            <span className="text-zinc-500">orderFormId </span>
            <code className="font-[family-name:var(--font-geist-mono)] break-all text-blue-400">
              {orderFormId}
            </code>
          </div>
        )}
      </div>
    </header>
  )
}
