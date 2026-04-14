import { createClient } from "../src";

const client = createClient({
  baseUrl: "https://mystore.vtexcommercestable.com.br",
  appKey: "vtexappkey-mystore-XXXXXXXX",
  appToken: "YYYYYYYYYYYYYYYYYYYYYY",
});

async function main() {
  await client.session.createSession();
  console.log("Session created");

  const orderForm = await client.checkout.createOrderForm();
  console.log("Order form created:", orderForm.orderFormId);

  const updated = await client.checkout.addItem(orderForm.orderFormId, [
    { id: 1234, quantity: 2, seller: "1" },
  ]);
  console.log("Item added. Items in cart:", updated.items.length);

  const withCoupon = await client.checkout.addCoupon(
    orderForm.orderFormId,
    "DISCOUNT10"
  );
  console.log("Coupon applied. Total:", withCoupon.value);

  const withShipping = await client.checkout.setShipping(orderForm.orderFormId, {
    address: {
      addressType: "residential",
      receiverName: "Test User",
      addressId: "home",
      postalCode: "01310-100",
      city: "São Paulo",
      state: "SP",
      country: "BRA",
      street: "Av. Paulista",
      number: "1000",
      neighborhood: "Bela Vista",
      complement: "",
      reference: "",
    },
  });
  console.log("Shipping set:", withShipping.shippingData?.address?.city);

  const withProfile = await client.checkout.setClientProfile(
    orderForm.orderFormId,
    {
      email: "customer@example.com",
      firstName: "Test",
      lastName: "Customer",
      document: "12345678901",
      documentType: "cpf",
      phone: "+5511999999999",
      isCorporate: false,
      corporateName: null,
      tradeName: null,
      corporateDocument: null,
      stateInscription: null,
    }
  );
  console.log("Profile set:", withProfile.clientProfileData?.email);

  const order = await client.checkout.placeOrder(orderForm.orderFormId);
  console.log("Order placed:", order);
}

main().catch(console.error);
