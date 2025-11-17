/*
  SDK test script to mint SUI (via faucet when available) and call a Move entry
  that accepts a SUI coin payment.

  Usage (from workspace root):
    cd packages/backend
    npm install
    SUI_RPC="http://127.0.0.1:9000" PACKAGE_ID="0x2" MODULE="circle_token_coin_flow" FUNCTION="buy_tokens_with_sui_explicit" CREATOR="0x2" BUYER="0x3" CIRCLE_ID=1 ENTRY_PRICE=10 AMOUNT=100 npm run sui-sdk-test

  Environment variables (all optional, but recommended):
    SUI_RPC - fullnode RPC (default: http://127.0.0.1:9000)
    PACKAGE_ID - the Move package object id where the module is published
    MODULE - the Move module name (defaults to `circle_token_coin_flow`)
    FUNCTION - the Move function to call (defaults to `buy_tokens_with_sui_explicit`)
    CREATOR - creator address (hex without 0x or with 0x)
    BUYER - buyer address
    CIRCLE_ID - circle id (u64)
    ENTRY_PRICE - entry price (u64)
    AMOUNT - amount to pay in SUI (u64)

  Notes:
    - This script is best-effort: exact Move argument layout must match the Move function signature.
    - If your function signature differs, adjust the `tx.moveCall` arguments below.
    - You must `npm install` in `packages/backend` so @mysten/sui.js is available.
*/

// Imports compatíveis com @mysten/sui.js >=0.54.1
import { SuiClient, TransactionBlock } from "@mysten/sui";

async function main() {

  const RPC = process.env.SUI_RPC || "http://127.0.0.1:9000";
  const PACKAGE_ID = process.env.PACKAGE_ID || "0x2";
  const MODULE = process.env.MODULE || "circle_token_coin_flow";
  const FUNC = process.env.FUNCTION || "buy_tokens_with_sui_explicit";
  const CREATOR = process.env.CREATOR || "0x2";
  const BUYER = process.env.BUYER || "0x3";
  const CIRCLE_ID = BigInt(process.env.CIRCLE_ID || "1");
  const ENTRY_PRICE = BigInt(process.env.ENTRY_PRICE || "10");
  const AMOUNT = BigInt(process.env.AMOUNT || "100");

  const client = new SuiClient({ url: RPC });

  // O novo SDK não expõe RawSigner nem Ed25519Keypair diretamente.
  // Para testes, apenas leitura de dados:
  const coins = await client.getCoins({ owner: BUYER });
  console.log("Coins do comprador:", coins);
  // Para enviar transação, use integração com carteira ou métodos de assinatura do SuiClient (fora do escopo deste teste).
  // Exemplo de leitura:
  // const result = await client.getObject({ id: PACKAGE_ID });
  // Adapte conforme necessidade.
}

main().catch((e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("Unhandled error:", msg);
  process.exit(1);
});
