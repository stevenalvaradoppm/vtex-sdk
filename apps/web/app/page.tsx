"use client";

import { useState } from "react";

interface LogEntry {
  timestamp: string;
  type: "info" | "success" | "error";
  message: string;
  data?: unknown;
}

interface ItemInput {
  id: string;
  quantity: number;
  seller: string;
}

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [orderFormId, setOrderFormId] = useState<string>("");
  const [orderFormData, setOrderFormData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Add Items form state
  const [itemId, setItemId] = useState("1");
  const [itemQty, setItemQty] = useState("1");
  const [itemSeller, setItemSeller] = useState("1");

  const addLog = (type: LogEntry["type"], message: string, data?: unknown) => {
    setLogs((prev) => [
      {
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
        data,
      },
      ...prev,
    ]);
  };

  const handleCreateSession = async () => {
    setLoading("session");
    addLog("info", "Creating VTEX session...");
    try {
      const res = await fetch("/api/vtex/session", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        addLog("success", "Session created successfully", json);
      } else {
        addLog("error", `Session failed: ${json.error}`, json);
      }
    } catch (err) {
      addLog("error", `Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setLoading(null);
    }
  };

  const handleCreateOrderForm = async () => {
    setLoading("orderForm");
    addLog("info", "Creating order form...");
    try {
      const res = await fetch("/api/vtex/order-form", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        const ofId = json.data?.orderFormId ?? "";
        setOrderFormId(ofId);
        setOrderFormData(json.data);
        addLog("success", `Order form created: ${ofId}`, json.data);
      } else {
        addLog("error", `Order form failed: ${json.error}`, json);
      }
    } catch (err) {
      addLog("error", `Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setLoading(null);
    }
  };

  const handleAddItems = async () => {
    if (!orderFormId) {
      addLog("error", "No order form ID. Create an order form first.");
      return;
    }

    const items: ItemInput[] = [
      { id: itemId, quantity: Number(itemQty), seller: itemSeller },
    ];

    setLoading("addItems");
    addLog("info", `Adding items to order ${orderFormId}...`, items);
    try {
      const res = await fetch("/api/vtex/add-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderFormId, items }),
      });
      const json = await res.json();
      if (json.success) {
        setOrderFormData(json.data);
        addLog("success", "Items added successfully", json.data);
      } else {
        addLog("error", `Add items failed: ${json.error}`, json);
      }
    } catch (err) {
      addLog("error", `Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>VTEX SDK Dashboard</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: "0.875rem" }}>
          Interact with the VTEX Checkout API via <code>@repo/sdk</code>
        </p>
      </header>

      <div style={gridStyle}>
        {/* Left column — Actions */}
        <div style={columnStyle}>
          {/* Step 1: Session */}
          <section style={cardStyle}>
            <h2 style={cardTitleStyle}>1. Create Session</h2>
            <p style={descStyle}>
              Initializes a VTEX session and stores authentication cookies.
            </p>
            <button
              onClick={handleCreateSession}
              disabled={loading !== null}
              style={btnPrimary}
            >
              {loading === "session" ? "Creating..." : "Create Session"}
            </button>
          </section>

          {/* Step 2: Order Form */}
          <section style={cardStyle}>
            <h2 style={cardTitleStyle}>2. Create Order Form</h2>
            <p style={descStyle}>
              Creates a new checkout order form (includes session creation).
            </p>
            <button
              onClick={handleCreateOrderForm}
              disabled={loading !== null}
              style={btnPrimary}
            >
              {loading === "orderForm" ? "Creating..." : "Create Order Form"}
            </button>
            {orderFormId && (
              <div style={infoBoxStyle}>
                <strong>Order Form ID:</strong>
                <code style={codeStyle}>{orderFormId}</code>
              </div>
            )}
          </section>

          {/* Step 3: Add Items */}
          <section style={cardStyle}>
            <h2 style={cardTitleStyle}>3. Add Items</h2>
            <p style={descStyle}>
              Add items to the current order form.
            </p>
            <div style={formGridStyle}>
              <label style={labelStyle}>
                SKU ID
                <input
                  style={inputStyle}
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  placeholder="e.g. 1"
                />
              </label>
              <label style={labelStyle}>
                Quantity
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  value={itemQty}
                  onChange={(e) => setItemQty(e.target.value)}
                />
              </label>
              <label style={labelStyle}>
                Seller
                <input
                  style={inputStyle}
                  value={itemSeller}
                  onChange={(e) => setItemSeller(e.target.value)}
                  placeholder="e.g. 1"
                />
              </label>
            </div>
            <button
              onClick={handleAddItems}
              disabled={loading !== null || !orderFormId}
              style={{
                ...btnPrimary,
                opacity: !orderFormId ? 0.5 : 1,
                cursor: !orderFormId ? "not-allowed" : "pointer",
              }}
            >
              {loading === "addItems" ? "Adding..." : "Add Items"}
            </button>
            {!orderFormId && (
              <p style={{ fontSize: "0.75rem", color: "#f59e0b", marginTop: "0.5rem" }}>
                Create an order form first to enable this action.
              </p>
            )}
          </section>
        </div>

        {/* Right column — Logs & Response */}
        <div style={columnStyle}>
          {/* Response Viewer */}
          {orderFormData !== null && (
            <section style={cardStyle}>
              <h2 style={cardTitleStyle}>Order Form Response</h2>
              <pre style={preStyle}>
                {JSON.stringify(orderFormData, null, 2)}
              </pre>
            </section>
          )}

          {/* Activity Log */}
          <section style={{ ...cardStyle, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={cardTitleStyle}>Activity Log</h2>
              {logs.length > 0 && (
                <button
                  onClick={() => setLogs([])}
                  style={btnSecondary}
                >
                  Clear
                </button>
              )}
            </div>
            {logs.length === 0 ? (
              <p style={{ opacity: 0.5, fontSize: "0.875rem" }}>
                No activity yet. Use the actions on the left to get started.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {logs.map((log, i) => (
                  <div key={i} style={logEntryStyle(log.type)}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={logBadgeStyle(log.type)}>
                        {log.type === "success" ? "✓" : log.type === "error" ? "✗" : "→"}
                      </span>
                      <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>{log.timestamp}</span>
                      <span style={{ fontSize: "0.875rem" }}>{log.message}</span>
                    </div>
                    {log.data !== undefined && log.data !== null && (
                      <pre style={{ ...preStyle, marginTop: "0.5rem", fontSize: "0.75rem" }}>
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* ── Inline Styles ─────────────────────────────────────────────── */

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "2rem",
  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "2rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid rgba(128,128,128,0.2)",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1.5rem",
  alignItems: "start",
};

const columnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(128,128,128,0.06)",
  border: "1px solid rgba(128,128,128,0.15)",
  borderRadius: "12px",
  padding: "1.25rem",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 600,
  marginBottom: "0.5rem",
};

const descStyle: React.CSSProperties = {
  fontSize: "0.825rem",
  opacity: 0.65,
  marginBottom: "1rem",
  lineHeight: 1.4,
};

const btnPrimary: React.CSSProperties = {
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  background: "#0070f3",
  color: "#fff",
  fontWeight: 600,
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "opacity 0.15s",
};

const btnSecondary: React.CSSProperties = {
  padding: "0.3rem 0.7rem",
  borderRadius: "6px",
  border: "1px solid rgba(128,128,128,0.3)",
  background: "transparent",
  color: "inherit",
  fontSize: "0.75rem",
  cursor: "pointer",
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "0.75rem",
  marginBottom: "1rem",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.3rem",
  fontSize: "0.75rem",
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid rgba(128,128,128,0.3)",
  background: "rgba(128,128,128,0.08)",
  color: "inherit",
  fontSize: "0.875rem",
};

const infoBoxStyle: React.CSSProperties = {
  marginTop: "0.75rem",
  padding: "0.5rem 0.75rem",
  background: "rgba(0,112,243,0.08)",
  borderRadius: "6px",
  fontSize: "0.8rem",
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
  flexWrap: "wrap",
};

const codeStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "0.75rem",
  wordBreak: "break-all",
};

const preStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.15)",
  borderRadius: "8px",
  padding: "0.75rem",
  overflow: "auto",
  maxHeight: "300px",
  fontSize: "0.8rem",
  fontFamily: "var(--font-geist-mono), monospace",
  lineHeight: 1.5,
};

const logEntryStyle = (type: LogEntry["type"]): React.CSSProperties => ({
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  background:
    type === "success"
      ? "rgba(34,197,94,0.08)"
      : type === "error"
        ? "rgba(239,68,68,0.08)"
        : "rgba(128,128,128,0.06)",
  border: `1px solid ${
    type === "success"
      ? "rgba(34,197,94,0.2)"
      : type === "error"
        ? "rgba(239,68,68,0.2)"
        : "rgba(128,128,128,0.1)"
  }`,
});

const logBadgeStyle = (type: LogEntry["type"]): React.CSSProperties => ({
  fontWeight: 700,
  fontSize: "0.8rem",
  color:
    type === "success"
      ? "#22c55e"
      : type === "error"
        ? "#ef4444"
        : "#6b7280",
});
