// Minimal module to validate creation and publication of a CoinBalance object
// This module is intentionally small and conservative: it demonstrates
// creating a UID via `object::new(ctx)` and publishing the object to an
// owner address. Use this to validate the `object::new` pattern in tests.

#[allow(unused_field, unused_use, lint(public_entry))]
module creator_circles::coin_balance_publisher {
    use sui::object;
    use sui::object::UID;
    use sui::tx_context::TxContext;
    use sui::transfer;

    /// Simple on-chain object representing a token-like balance placeholder.
    struct CoinBalance has key, store {
        id: UID,
        owner: address,
        amount: u64
    }

    /// Create and publish a `CoinBalance` object for `owner` with `amount`.
    /// This function is intentionally an entry-like public function that
    /// accepts a `TxContext` to exercise `object::new(ctx)` patterns used
    /// elsewhere in the codebase.
    public fun create_and_publish_coin_balance(owner: address, amount: u64, ctx: &mut TxContext) {
        let uid = object::new(ctx);
        let bal = CoinBalance { id: uid, owner: owner, amount: amount };
        // Transfer (publish) the newly created object to the owner address so it becomes on-chain
        transfer::public_transfer(bal, owner);
    }
}
