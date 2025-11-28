// events.move — Eventos customizados para indexação

module creator_circles::events {
    use sui::object::{Self, UID, ID};
    use sui::event;
    use std::string::{Self, String, utf8};

    /// Evento de criação de círculo
    struct CircleCreated has copy, drop {
        circle_id: ID,
        creator: address,
        name: String,
        entry_price: u64,
        timestamp: u64,
    }

    /// Evento de membro entrando
    struct MemberJoined has copy, drop {
        circle_id: ID,
        member: address,
        payment_amount: u64,
        total_members: u64,
    }

    /// Evento de liquidez adicionada
    struct LiquidityAdded has copy, drop {
        pool_id: ID,
        provider: address,
        amount_a: u64,
        amount_b: u64,
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
}
