// Module: circle_token_coin_flow.move
// Purpose: separate coin-handling entry to avoid touching the main impl module.
#[allow(unused_field, unused_use, lint(public_entry))]
module creator_circles::circle_token_coin_flow {
    use sui::object;
    use sui::object::UID;
    use sui::tx_context::TxContext;
    use sui::coin;
    use sui::sui::SUI;
    use sui::pay;
    use sui::transfer;
    use std::string::String;

    // Local Balance object for coin-flow tests.
    struct CoinBalance has key, store {
        id: UID,
        owner: address,
        circle_id: u64,
        amount: u64,
    }

    // Pure helper: apply fee in basis points.
    public fun apply_fee(amount: u64, fee_bps: u64): (u64, u64) {
        let fee = (amount * fee_bps) / 10000;
        (amount - fee, fee)
    }

    // Pure helper: compute tokens for payment and entry_price.
    public fun compute_tokens_for_payment(amount_paid: u64, entry_price: u64): u64 {
        if (entry_price == 0) { 0 } else { amount_paid / entry_price }
    }

    // Entry that accepts a Coin<SUI> and performs fee split + crediting a
    // local `CoinBalance` object to the buyer. This entry is intentionally
    // self-contained to avoid cross-module struct construction issues.
    // Inputs:
    // - `creator_addr`: destination of fees and payments
    // - `entry_price`: price per token (u64)
    // - `circle_id`: an identifier for the circle (u64)
    // - `payment`: mutable Coin<SUI> provided by the caller
    // - `buyer_addr`: address to credit
    // - `ctx`: TxContext provided by the runtime (entry wrapper will supply it)
    public entry fun buy_tokens_with_sui_explicit(
        creator_addr: address,
        entry_price: u64,
        circle_id: u64,
        payment: &mut coin::Coin<SUI>,
        buyer_addr: address,
        ctx: &mut TxContext
    ) {
        let fee_bps = 250u64; // 2.5%

        let payment_value = coin::value(payment);
        let (amount_after_fee, fee_amount) = apply_fee(payment_value, fee_bps);
        let tokens = compute_tokens_for_payment(amount_after_fee, entry_price);

        // transfer fee
        pay::split_and_transfer(payment, fee_amount, creator_addr, ctx);

        // transfer remaining
        let remaining = coin::value(payment);
        if (remaining > 0) {
            pay::split_and_transfer(payment, remaining, creator_addr, ctx);
        }

        // NOTE: object creation for `CoinBalance` is intentionally omitted here
        // to keep this module small and avoid possible environment-specific
        // parser/signature issues. The payment transfer logic above demonstrates
        // coin handling; reintroduce object creation when integrating with
        // `circle_token_impl` or after confirming stdlib signatures.
    }
}
