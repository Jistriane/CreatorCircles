// circle_token.move
// Token fungível base para um Circle. Esboço inicial — revisar e auditar
module creator_circles::circle_token {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::object::{Self, UID};
    use std::string::{Self, String};
    use std::vector;

    /// Informação de cada círculo guardada no objeto de metadata
    struct CircleInfo has key, store {
        id: UID,
        creator: address,
        circle_id: String,
        total_supply: u64,
        entry_price: u64 // em MIST (1 SUI = 1_000_000_000 MIST)
    }

    /// Evento simplificado de compra
    struct TokensPurchased has copy, drop {
        buyer: address,
        amount: u64,
        circle_id: String
    }

    // Cria o token do círculo (mint inicial para o criador)
    public entry fun create_circle_token(
        ctx: &mut TxContext,
        name: String,
        symbol: String,
        initial_supply: u64,
        entry_price: u64
    ) {
        let creator = tx_context::sender(ctx);
        // Nota: coin::create_currency é uma operação Sui específica — esboço
        let (treasury, metadata) = coin::create_currency<Self::CircleToken>(
            CircleInfo { id: object::new(ctx), creator, circle_id: String::utf8(""), total_supply: initial_supply, entry_price },
            initial_supply,
            symbol,
            name,
            b"",
            option::none(),
            ctx
        );

        // transferir treasury para o criador
        transfer::public_transfer(treasury, creator);
    }

    // Compra de tokens pagando em SUI — esboço
    public entry fun buy_tokens(
        payment: Coin<sui::sui::SUI>,
        treasury: &mut TreasuryCap<Self::CircleToken>,
        amount: u64,
        ctx: &mut TxContext
    ) acquires CircleInfo {
        let payer = tx_context::sender(ctx);
        // Busca informações do círculo (placeholder)
        // let circle_info = ...;

        // Lógica: calcular required_sui = circle_info.entry_price * amount
        // Validar valor do payment e dividir shares (criador 80%, dao 10%, plataforma 10% por exemplo)

        // Mint e transfer tokens ao comprador
        let _tokens = coin::mint_and_transfer(treasury, amount, payer, ctx);

        // Emitir evento
        sui::event::emit(TokensPurchased { buyer: payer, amount, circle_id: String::utf8("") });
    }
}
