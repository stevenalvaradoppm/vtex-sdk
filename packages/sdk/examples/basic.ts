import { createClient } from "../src";

const client = createClient({
  baseUrl: "https://mystore.vtexcommercestable.com.br",
  appKey: "vtexappkey-mystore-XXXXXXXX",
  appToken: "YYYYYYYYYYYYYYYYYYYYYY",
});

async function main() {
  await client.session.createSession();
  console.log("Session created");

  const session = await client.session.getSession();
  console.log("Session id:", session.id);
}

main().catch(console.error);
