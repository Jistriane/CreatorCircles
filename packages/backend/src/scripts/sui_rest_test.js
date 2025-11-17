// Teste de integração Sui via REST (RPC)
import fetch from 'node-fetch';

const RPC = process.env.SUI_RPC || "https://fullnode.mainnet.sui.io:443";
const BUYER = process.env.BUYER || "0x3";

async function main() {
  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "suix_getCoins",
    params: {
      owner: BUYER
    }
  };
  const res = await fetch(RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  console.log("Coins do comprador:", JSON.stringify(data, null, 2));
}

main().catch((e) => {
  console.error("Erro:", e.message || e);
  process.exit(1);
});
