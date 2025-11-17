module 0x0::coin_flow_full_test {
    use creator_circles::circle_token_coin_flow;

    #[test]
    fun test_coin_flow_helpers_compile_again() {
        let (amt, fee) = circle_token_coin_flow::apply_fee(500u64, 250u64);
        let tokens = circle_token_coin_flow::compute_tokens_for_payment(100u64, 10u64);
        let _ = amt;
        let _ = fee;
        let _ = tokens;
    }
}
