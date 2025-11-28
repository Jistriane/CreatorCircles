// liquidity_pool.move — AMM básico para liquidez de tokens Circle
// Inspirado no padrão Uniswap V2, simplificado para Sui

module creator_circles::liquidity_pool {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use std::string::{Self, String, utf8};
    use sui::event;

    /// Estrutura do pool de liquidez
    struct LiquidityPool has key {
        id: UID,
        token_a: ID, // Circle Token
        token_b: ID, // SUI
        reserve_a: Balance<SUI>,
        reserve_b: Balance<SUI>,
        total_liquidity: u64,
        fee_bps: u64, // ex: 30 = 0.3%
    }

    /// Evento de swap
    struct SwapEvent has copy, drop {
        pool_id: ID,
        user: address,
        amount_in: u64,
        amount_out: u64,
        token_in: ID,
        token_out: ID,
    }

    /// Cria pool de liquidez
    public fun create_pool(
        token_a: ID,
        token_b: ID,
        fee_bps: u64,
        ctx: &mut TxContext
    ): LiquidityPool {
        LiquidityPool {
            id: object::new(ctx),
            token_a,
            token_b,
            reserve_a: balance::zero(),
            reserve_b: balance::zero(),
            total_liquidity: 0,
            fee_bps,
        }
    }

    /// Adiciona liquidez ao pool
    public fun add_liquidity(
        pool: &mut LiquidityPool,
        amount_a: u64,
        amount_b: u64
    ) {
        // Simples: incrementa reservas
        pool.reserve_a = balance::add(&pool.reserve_a, amount_a);
        pool.reserve_b = balance::add(&pool.reserve_b, amount_b);
        pool.total_liquidity = pool.total_liquidity + amount_a; // simplificado
    }

    /// Realiza swap (token_a -> token_b)
    public fun swap(
        pool: &mut LiquidityPool,
        amount_in: u64,
        user: address,
        ctx: &mut TxContext
    ): u64 {
        // Fórmula x*y=k simplificada
        let reserve_in = balance::value(&pool.reserve_a);
        let reserve_out = balance::value(&pool.reserve_b);
        let amount_in_with_fee = amount_in * (10000 - pool.fee_bps) / 10000;
        let numerator = amount_in_with_fee * reserve_out;
        let denominator = reserve_in + amount_in_with_fee;
        let amount_out = numerator / denominator;

        // Atualiza reservas
        pool.reserve_a = balance::add(&pool.reserve_a, amount_in);
        pool.reserve_b = balance::sub(&pool.reserve_b, amount_out);

        // Emite evento
        event::emit(SwapEvent {
            pool_id: object::id(pool),
            user,
            amount_in,
            amount_out,
            token_in: pool.token_a,
            token_out: pool.token_b,
        });

        amount_out
    }
}
