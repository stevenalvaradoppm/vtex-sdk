import { createClient } from "../src";

const client = createClient({
  baseUrl: "https://mystore.vtexcommercestable.com.br",
  appKey: "vtexappkey-mystore-XXXXXXXX",
  appToken: "YYYYYYYYYYYYYYYYYYYYYY",
});

async function main() {
  // 1. Create session
  await client.session.createSession();
  console.log("Session created");

  // 2. Create cart
  const orderForm = await client.checkout.createOrderForm();
  console.log("Cart created:", orderForm.orderFormId);

  // 3. Get products
  const products = await client.checkout.getProducts();
  console.log("Products fetched:", products);
}

main().catch(console.error);
