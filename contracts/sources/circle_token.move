// circle_token.move — stable scaffold with pure helpers to allow `sui move check` to pass.
// This module intentionally keeps logic off-chain friendly and avoids low-level
// `TxContext`/`object::new` calls until we're ready to wire Sui object lifecycle.

#[allow(unused_field, unused_use)]
module creator_circles::circle_token {
    use sui::object::UID;
    use sui::tx_context::TxContext;
    use sui::transfer;
    use std::string::String;

    /// Circle metadata object (scaffold)
    struct CircleInfo has key, store {
        id: UID,
        creator: address,
        symbol: String,
        total_supply: u64,
        entry_price: u64,
    }

    /// Per-account balance object for a given Circle
    struct Balance has key, store {
        id: UID,
        owner: address,
        circle: UID,
        amount: u64,
    }

    /// Mint capability object (authority). Only holder of MintCap can mint new tokens.
    struct MintCap has key, store {
        id: UID,
    }

    // Event placeholders
    // Use `store` ability here because UID does not have `copy`/`drop` abilities.
    struct CircleCreated has store {
        circle: UID,
        creator: address,
        symbol: String,
    }

    struct TokensPurchased has store {
        buyer: address,
        amount: u64,
        circle: UID,
    }

    // Pure helper: compute how many tokens correspond to an amount paid with a fixed entry price.
    public fun compute_tokens_for_payment(amount_paid: u64, entry_price: u64): u64 {
        if (entry_price == 0) {
            0
        } else {
            amount_paid / entry_price
        }
    }

    // Pure helper: apply a fee in basis points and return (amount_after_fee, fee_amount).
    public fun apply_fee(amount: u64, fee_bps: u64): (u64, u64) {
        // fee_bps is in basis points (1 bps = 0.01%). Max 10000.
        let fee = (amount * fee_bps) / 10000;
        (amount - fee, fee)
    }

    // Placeholder for balance calculation — actual on-chain reading should be done by explorers/indexers.
    // To avoid requiring UID dropping in this scaffold, accept a plain circle identifier for queries.
    public fun balance_of(_owner: address, _circle_id: u64): u64 {
        0
    }

    // Logical API (non-entry): these helpers accept explicit addresses and act as pure
    // placeholders until full Sui object/coin flows are implemented.
    public fun create_circle_logical(creator: address, symbol: String, initial_supply: u64, entry_price: u64) {
        let _creator = creator;
        let _symbol = symbol;
        let _initial_supply = initial_supply;
        let _entry_price = entry_price;
        // TODO: allocate CircleInfo and MintCap objects and publish them using TxContext
    }

    // Logical (pure) buy tokens helper. Returns (tokens_minted, fee_amount).
    // Uses `apply_fee` with a default fee in basis points (e.g., 250 bps = 2.5%).
    public fun buy_tokens_logical(circle_id: u64, buyer: address, amount_paid: u64): (u64, u64) {
        let _circle_id = circle_id;
        let _buyer = buyer;
        // default fee: 250 bps (2.5%)
        let fee_bps = 250u64;
        let (amount_after_fee, fee) = apply_fee(amount_paid, fee_bps);
        // For logical calculation we need a circle entry price; in this scaffold we
        // don't have on-chain storage to look up the circle, so assume an example
        // entry price. In real implementation this should be read from CircleInfo.
        let entry_price = 10u64;
        let tokens = compute_tokens_for_payment(amount_after_fee, entry_price);
        (tokens, fee)
    }

    // On-chain entry wrappers: lightweight entry functions that forward to logical helpers.
    // These allow callers/tests to invoke the on-chain API using a signer.
    // Full coin-handling and object lifecycle will be implemented in a subsequent step.
    // Entry variant that accepts an explicit creator address. Using `&signer` requires
    // a canonical signer import that varies between stdlib versions; to keep the module
    // compatible across environments we accept an `address` and forward to the logical API.
    public entry fun create_circle_entry(creator_addr: address, symbol: String, initial_supply: u64, entry_price: u64) {
        // forward to logical helper (accepts an address)
        create_circle_logical(creator_addr, symbol, initial_supply, entry_price);
    }

    // Entry that wires the runtime TxContext to the implementation module which
    // performs `object::new(ctx)` allocations. This forwards to
    // `creator_circles::circle_token_impl::create_circle_internal` and then
    // publishes/transfers the created objects to the creator address so they
    // become owned on-chain.
    public entry fun create_circle_entry_with_ctx(creator_addr: address, symbol: String, initial_supply: u64, entry_price: u64, ctx: &mut TxContext) {
        let (circle, mintcap, balance) = creator_circles::circle_token_impl::create_circle_internal(creator_addr, symbol, initial_supply, entry_price, ctx);
        // Transfer ownership of created objects to the creator address so they are published
        transfer::public_transfer(circle, creator_addr);
        transfer::public_transfer(mintcap, creator_addr);
        transfer::public_transfer(balance, creator_addr);
    }

    public entry fun buy_tokens_entry(buyer_addr: address, circle_id: u64, amount_paid: u64): (u64, u64) {
        buy_tokens_logical(circle_id, buyer_addr, amount_paid)
    }
}
