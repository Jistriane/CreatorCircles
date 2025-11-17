// SDK test script em JavaScript ESM para integração Sui
import { SuiClient, TransactionBlock } from "@mysten/sui.js";

const RPC = process.env.SUI_RPC || "http://127.0.0.1:9000";
const PACKAGE_ID = process.env.PACKAGE_ID || "0x2";
const MODULE = process.env.MODULE || "circle_token_coin_flow";
const FUNC = process.env.FUNCTION || "buy_tokens_with_sui_explicit";
const CREATOR = process.env.CREATOR || "0x2";
const BUYER = process.env.BUYER || "0x3";
const CIRCLE_ID = BigInt(process.env.CIRCLE_ID || "1");
const ENTRY_PRICE = BigInt(process.env.ENTRY_PRICE || "10");
const AMOUNT = BigInt(process.env.AMOUNT || "100");

async function main() {
  const client = new SuiClient({ url: RPC });
  // Apenas leitura de dados para teste:
  const coins = await client.getCoins({ owner: BUYER });
  console.log("Coins do comprador:", coins);
  // Para enviar transação, use integração com carteira ou métodos de assinatura do SuiClient.
}

main().catch((e) => {
  console.error("Erro:", e.message || e);
  process.exit(1);
});
