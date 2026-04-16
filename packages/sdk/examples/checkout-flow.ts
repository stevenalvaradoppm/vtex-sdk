import { createClient } from "../src";
import type { ShippingDataInput, ClientProfileDataInput } from "../src";

const client = createClient({
  baseUrl: "https://mystore.vtexcommercestable.com.br",
  appKey: "vtexappkey-mystore-XXXXXXXX",
  appToken: "YYYYYYYYYYYYYYYYYYYYYY",
});

async function main() {
  // 1. Create session (optional email for authenticated checkout)
  await client.session.createSession("customer@example.com");
  console.log("1. Session created");

  // 2. Create cart
  const orderForm = await client.checkout.createOrderForm();
  console.log("2. Cart created:", orderForm.orderFormId);

  // 3. Get products
  const products = await client.checkout.getProducts();
  console.log("3. Products fetched:", products);

  // 4. Add item by SKU ID
  const withItem = await client.checkout.addItem(orderForm.orderFormId, [
    { id: "880011", quantity: 1, seller: "1" },
  ]);
  console.log("4. Item added. Items in cart:", withItem.items.length);

  // 5. Attach shipping data
  const shippingData: ShippingDataInput = {
    clearAddressIfPostalCodeNotFound: false,
    logisticsInfo: {
      itemIndex: 0,
      selectedDeliveryChannel: "delivery",
      selectedSla: "normal",
    },
    selectedAddresses: [
      {
        addressName: "home",
        addressType: "residential",
        city: "Quito",
        country: "ECU",
        geoCoordinates: [-78.4678, -0.1807],
        number: "123",
        receiverName: "Test User",
        street: "Av. Example",
        complement: "",
      },
    ],
  };
  const withShipping = await client.checkout.setShipping(
    orderForm.orderFormId,
    shippingData
  );
  console.log("5. Shipping attached. Status:", withShipping.status);

  // 6. Attach client profile
  const profileData: ClientProfileDataInput = {
    document: "0000000000",
    documentType: "cedula",
    email: "customer@example.com",
    firstName: "Test",
    lastName: "User",
    homePhone: "+5930000000000",
  };
  const withProfile = await client.checkout.setClientProfile(
    orderForm.orderFormId,
    profileData
  );
  console.log("6. Profile attached. Status:", withProfile.status);
}

main().catch(console.error);
