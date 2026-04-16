"use client";

import { useState, useTransition } from "react";
import type {
  AddItemInput,
  ShippingDataInput,
  ClientProfileDataInput,
  OrderForm,
} from "@repo/sdk";

type Status = "idle" | "loading" | "done" | "error";

interface LogEntry {
  ts: string;
  type: "info" | "success" | "error";
  msg: string;
  data?: unknown;
}

interface Props {
  createSession: (email?: string) => Promise<void>;
  createOrderForm: () => Promise<OrderForm>;
  getProducts: () => Promise<unknown>;
  addItem: (id: string, items: AddItemInput[]) => Promise<OrderForm>;
  setShipping: (id: string, data: ShippingDataInput) => Promise<OrderForm>;
  setClientProfile: (id: string, data: ClientProfileDataInput) => Promise<OrderForm>;
}

/* ── tiny helpers ──────────────────────────────────────────── */
function badge(n: number, s: Status) {
  const base = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold";
  if (s === "loading")
    return <span className={`${base} border-2 border-blue-500 border-t-transparent animate-spin`} />;
  if (s === "done") return <span className={`${base} bg-green-500 text-white`}>✓</span>;
  if (s === "error") return <span className={`${base} bg-red-500 text-white`}>✗</span>;
  return <span className={`${base} bg-zinc-700 text-zinc-300`}>{n}</span>;
}

function stepBorder(s: Status, enabled: boolean) {
  if (!enabled) return "border-zinc-800 opacity-40";
  if (s === "loading") return "border-blue-500 shadow-[0_0_0_1px_rgb(59,130,246,0.3)]";
  if (s === "done") return "border-green-500/40 bg-green-500/[0.04]";
  if (s === "error") return "border-red-500/40 bg-red-500/[0.04]";
  return "border-zinc-800 hover:border-zinc-700";
}

const LABEL: Record<number, string> = {
  1: "Crear sesión",
  2: "Crear carrito",
  3: "Obtener productos",
  4: "Añadir items",
  5: "Shipping data",
  6: "Client profile",
};

function Input({ label, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        {...p}
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
      />
    </label>
  );
}

function Btn({
  onClick, disabled, loading, label,
}: { onClick: () => void; disabled?: boolean; loading?: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {loading ? "Procesando…" : label}
    </button>
  );
}

/* ── main component ────────────────────────────────────────── */
export default function VtexDashboard(props: Props) {
  const [isPending, startTransition] = useTransition();

  type Steps = { 1: Status; 2: Status; 3: Status; 4: Status; 5: Status; 6: Status };
  const [s, setS] = useState<Steps>({
    1: "idle", 2: "idle", 3: "idle", 4: "idle", 5: "idle", 6: "idle",
  });
  const [orderFormId, setOrderFormId] = useState("");
  const [products, setProducts] = useState<unknown>(null);
  const [orderForm, setOrderForm] = useState<OrderForm | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // form states
  const [email, setEmail] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemQty, setItemQty] = useState("1");
  const [itemSeller, setItemSeller] = useState("1");
  const [shipReceiver, setShipReceiver] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipStreet, setShipStreet] = useState("");
  const [shipNumber, setShipNumber] = useState("");
  const [shipComplement, setShipComplement] = useState("");
  const [shipCountry, setShipCountry] = useState("ECU");
  const [shipSla, setShipSla] = useState("normal");
  const [shipLat, setShipLat] = useState("-0.1807");
  const [shipLng, setShipLng] = useState("-78.4678");
  const [profFirst, setProfFirst] = useState("");
  const [profLast, setProfLast] = useState("");
  const [profEmail, setProfEmail] = useState("");
  const [profPhone, setProfPhone] = useState("");
  const [profDoc, setProfDoc] = useState("");
  const [profDocType, setProfDocType] = useState("cedula");

  const step = (n: keyof Steps, st: Status) => setS((p) => ({ ...p, [n]: st }));
  const log = (type: LogEntry["type"], msg: string, data?: unknown) =>
    setLogs((p) => [{ ts: new Date().toLocaleTimeString(), type, msg, data }, ...p]);

  const en = {
    1: true,
    2: s[1] === "done",
    3: s[2] === "done",
    4: s[3] === "done",
    5: s[4] === "done",
    6: s[5] === "done",
  };

  function run(n: keyof Steps, fn: () => Promise<void>) {
    startTransition(async () => {
      step(n, "loading");
      try {
        await fn();
        step(n, "done");
      } catch (e) {
        step(n, "error");
        log("error", e instanceof Error ? e.message : "Error desconocido");
      }
    });
  }

  const isLoading = (n: keyof Steps) => s[n] === "loading" && isPending;

  return (
    <div className="min-h-screen bg-zinc-950 font-[family-name:var(--font-geist-sans)]">
      {/* header */}
      <header className="border-b border-zinc-800 px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">VTEX SDK Dashboard</h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              Server Actions · <code className="font-[family-name:var(--font-geist-mono)]">@repo/sdk</code>
            </p>
          </div>
          {orderFormId && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs">
              <span className="text-zinc-500">orderFormId </span>
              <code className="font-[family-name:var(--font-geist-mono)] text-blue-400">{orderFormId.slice(0, 12)}…</code>
            </div>
          )}
        </div>
      </header>

      {/* stepper bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center">
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <div key={n} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                {badge(n, s[n as keyof Steps])}
                <span className={`whitespace-nowrap text-[10px] font-medium ${s[n as keyof Steps] === "done" ? "text-green-400" : en[n as keyof typeof en] ? "text-zinc-300" : "text-zinc-600"}`}>
                  {LABEL[n]}
                </span>
              </div>
              {i < 5 && (
                <div className={`mx-2 h-px flex-1 transition-colors duration-500 ${s[n as keyof Steps] === "done" ? "bg-green-500/50" : "bg-zinc-800"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* body */}
      <div className="mx-auto grid max-w-7xl grid-cols-5 gap-6 p-8">
        {/* ── steps column ──────────────────────────────────── */}
        <div className="col-span-3 flex flex-col gap-4">

          {/* Step 1 */}
          <section className={`rounded-2xl border p-5 transition-all duration-200 ${stepBorder(s[1], en[1])} ${!en[1] ? "pointer-events-none" : ""}`}>
            <div className="mb-4 flex items-center gap-3">
              {badge(1, s[1])}
              <div>
                <h3 className="text-sm font-semibold">Crear sesión</h3>
                <p className="text-xs text-zinc-500">Inicializa la sesión VTEX. El email es opcional.</p>
              </div>
            </div>
            <Input label="Email (opcional)" type="email" placeholder="user@tienda.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Btn onClick={() => run(1, async () => {
              await props.createSession(email || undefined);
              log("success", "Sesión creada correctamente");
            })} loading={isLoading(1)} label="Crear sesión" />
          </section>

          {/* Step 2 */}
          <section className={`rounded-2xl border p-5 transition-all duration-200 ${stepBorder(s[2], en[2])} ${!en[2] ? "pointer-events-none" : ""}`}>
            <div className="mb-4 flex items-center gap-3">
              {badge(2, s[2])}
              <div>
                <h3 className="text-sm font-semibold">Crear carrito</h3>
                <p className="text-xs text-zinc-500">Crea un nuevo orderForm (cart) en VTEX.</p>
              </div>
            </div>
            <Btn onClick={() => run(2, async () => {
              const of = await props.createOrderForm();
              setOrderFormId(of.orderFormId);
              setOrderForm(of);
              log("success", `Order form creado: ${of.orderFormId}`, of);
            })} loading={isLoading(2)} label="Crear carrito" />
          </section>

          {/* Step 3 */}
          <section className={`rounded-2xl border p-5 transition-all duration-200 ${stepBorder(s[3], en[3])} ${!en[3] ? "pointer-events-none" : ""}`}>
            <div className="mb-4 flex items-center gap-3">
              {badge(3, s[3])}
              <div>
                <h3 className="text-sm font-semibold">Obtener productos</h3>
                <p className="text-xs text-zinc-500">Consulta el catálogo vía Intelligent Search.</p>
              </div>
            </div>
            {s[3] === "done" && products != null && (
              <pre className="mb-3 max-h-40 overflow-auto rounded-lg bg-zinc-800 p-3 font-[family-name:var(--font-geist-mono)] text-[11px] text-zinc-300">
                {JSON.stringify(products, null, 2)}
              </pre>
            )}
            <Btn onClick={() => run(3, async () => {
              const data = await props.getProducts();
              setProducts(data);
              log("success", "Productos obtenidos", data);
            })} loading={isLoading(3)} label="Obtener productos" />
          </section>

          {/* Step 4 */}
          <section className={`rounded-2xl border p-5 transition-all duration-200 ${stepBorder(s[4], en[4])} ${!en[4] ? "pointer-events-none" : ""}`}>
            <div className="mb-4 flex items-center gap-3">
              {badge(4, s[4])}
              <div>
                <h3 className="text-sm font-semibold">Añadir items</h3>
                <p className="text-xs text-zinc-500">Agrega un SKU al carrito por su ID.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="SKU ID" placeholder="ej. 880011" value={itemId} onChange={(e) => setItemId(e.target.value)} />
              <Input label="Cantidad" type="number" min="1" value={itemQty} onChange={(e) => setItemQty(e.target.value)} />
              <Input label="Seller" placeholder="1" value={itemSeller} onChange={(e) => setItemSeller(e.target.value)} />
            </div>
            <Btn onClick={() => run(4, async () => {
              const of = await props.addItem(orderFormId, [{ id: itemId, quantity: Number(itemQty), seller: itemSeller }]);
              setOrderForm(of);
              log("success", `Item ${itemId} añadido (${of.items.length} item/s)`, of);
            })} loading={isLoading(4)} disabled={!itemId} label="Añadir item" />
          </section>

          {/* Step 5 */}
          <section className={`rounded-2xl border p-5 transition-all duration-200 ${stepBorder(s[5], en[5])} ${!en[5] ? "pointer-events-none" : ""}`}>
            <div className="mb-4 flex items-center gap-3">
              {badge(5, s[5])}
              <div>
                <h3 className="text-sm font-semibold">Attach shipping data</h3>
                <p className="text-xs text-zinc-500">Adjunta la dirección y opciones de envío.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Receptor" placeholder="Test User" value={shipReceiver} onChange={(e) => setShipReceiver(e.target.value)} />
              <Input label="País" placeholder="ECU" value={shipCountry} onChange={(e) => setShipCountry(e.target.value)} />
              <Input label="Ciudad" placeholder="Quito" value={shipCity} onChange={(e) => setShipCity(e.target.value)} />
              <Input label="Calle" placeholder="Av. Example" value={shipStreet} onChange={(e) => setShipStreet(e.target.value)} />
              <Input label="Número" placeholder="123" value={shipNumber} onChange={(e) => setShipNumber(e.target.value)} />
              <Input label="SLA" placeholder="normal" value={shipSla} onChange={(e) => setShipSla(e.target.value)} />
              <Input label="Complemento" placeholder="Apto 101" value={shipComplement} onChange={(e) => setShipComplement(e.target.value)} />
              <Input label="Lat" placeholder="-0.1807" value={shipLat} onChange={(e) => setShipLat(e.target.value)} />
              <Input label="Lng" placeholder="-78.4678" value={shipLng} onChange={(e) => setShipLng(e.target.value)} />
            </div>
            <Btn onClick={() => run(5, async () => {
              const of = await props.setShipping(orderFormId, {
                clearAddressIfPostalCodeNotFound: false,
                logisticsInfo: { itemIndex: 0, selectedDeliveryChannel: "delivery", selectedSla: shipSla },
                selectedAddresses: [{
                  addressName: "home", addressType: "residential",
                  city: shipCity, country: shipCountry,
                  geoCoordinates: shipLat && shipLng ? [parseFloat(shipLng), parseFloat(shipLat)] : [],
                  number: shipNumber, receiverName: shipReceiver, street: shipStreet,
                  complement: shipComplement,
                }],
              });
              setOrderForm(of);
              log("success", "Shipping data adjuntado", of);
            })} loading={isLoading(5)} label="Adjuntar shipping" />
          </section>

          {/* Step 6 */}
          <section className={`rounded-2xl border p-5 transition-all duration-200 ${stepBorder(s[6], en[6])} ${!en[6] ? "pointer-events-none" : ""}`}>
            <div className="mb-4 flex items-center gap-3">
              {badge(6, s[6])}
              <div>
                <h3 className="text-sm font-semibold">Attach client profile</h3>
                <p className="text-xs text-zinc-500">Adjunta los datos de identidad del cliente.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre" placeholder="Test" value={profFirst} onChange={(e) => setProfFirst(e.target.value)} />
              <Input label="Apellido" placeholder="User" value={profLast} onChange={(e) => setProfLast(e.target.value)} />
              <Input label="Email" type="email" placeholder="test@test.com" value={profEmail} onChange={(e) => setProfEmail(e.target.value)} />
              <Input label="Teléfono" placeholder="+5930000000000" value={profPhone} onChange={(e) => setProfPhone(e.target.value)} />
              <Input label="Documento" placeholder="0000000000" value={profDoc} onChange={(e) => setProfDoc(e.target.value)} />
              <Input label="Tipo doc." placeholder="cedula" value={profDocType} onChange={(e) => setProfDocType(e.target.value)} />
            </div>
            <Btn onClick={() => run(6, async () => {
              const of = await props.setClientProfile(orderFormId, {
                document: profDoc, documentType: profDocType,
                email: profEmail, firstName: profFirst,
                lastName: profLast, homePhone: profPhone,
              });
              setOrderForm(of);
              log("success", "Client profile adjuntado", of);
            })} loading={isLoading(6)} label="Adjuntar perfil" />
          </section>
        </div>

        {/* ── right panel ───────────────────────────────────── */}
        <div className="col-span-2 flex flex-col gap-4 self-start sticky top-6">
          {/* Order Form state */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-3 text-sm font-semibold">Order Form</h2>
            {orderForm ? (
              <pre className="max-h-64 overflow-auto rounded-lg bg-zinc-800 p-3 font-[family-name:var(--font-geist-mono)] text-[11px] text-zinc-300">
                {JSON.stringify(orderForm, null, 2)}
              </pre>
            ) : (
              <p className="text-xs text-zinc-600">Aún no hay datos. Completa el flujo.</p>
            )}
          </div>

          {/* Activity log */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Activity Log</h2>
              {logs.length > 0 && (
                <button onClick={() => setLogs([])} className="text-[10px] text-zinc-600 hover:text-zinc-400">
                  Limpiar
                </button>
              )}
            </div>
            {logs.length === 0 ? (
              <p className="text-xs text-zinc-600">Sin actividad. Ejecuta el flujo paso a paso.</p>
            ) : (
              <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
                {logs.map((l, i) => (
                  <div key={i} className={`rounded-lg border px-3 py-2 text-xs ${l.type === "success" ? "border-green-500/20 bg-green-500/5 text-green-400" : l.type === "error" ? "border-red-500/20 bg-red-500/5 text-red-400" : "border-zinc-700 text-zinc-400"}`}>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 font-bold">
                        {l.type === "success" ? "✓" : l.type === "error" ? "✗" : "→"}
                      </span>
                      <span className="text-zinc-600">{l.ts}</span>
                      <span>{l.msg}</span>
                    </div>
                    {l.data != null && (
                      <pre className="mt-1.5 max-h-28 overflow-auto rounded bg-zinc-800 p-2 font-[family-name:var(--font-geist-mono)] text-[10px] text-zinc-400">
                        {JSON.stringify(l.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
