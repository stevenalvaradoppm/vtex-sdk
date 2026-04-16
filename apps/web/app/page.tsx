import VtexDashboard from "./components/VtexDashboard";
import {
  createSessionAction,
  createOrderFormAction,
  getProductsAction,
  addItemAction,
  setShippingAction,
  setClientProfileAction,
} from "./actions";

export default function Home() {
  return (
    <VtexDashboard
      createSession={createSessionAction}
      createOrderForm={createOrderFormAction}
      getProducts={getProductsAction}
      addItem={addItemAction}
      setShipping={setShippingAction}
      setClientProfile={setClientProfileAction}
    />
  );
}
