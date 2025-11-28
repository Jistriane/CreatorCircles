
module creator_circles::circle_token {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::object::{Self, UID, ID};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::dynamic_field as df;
    use std::string::{Self, String};

    // ========== STRUCTS ========== 
    struct CIRCLE_TOKEN has drop {} // OTW

    /// Compartilhado para acesso múltiplo
    struct CircleRegistry has key {
        id: UID,
        circles: vector<ID>, // IDs de todos os círculos
    }

    /// Cada círculo é um shared object
    struct Circle has key {
        id: UID,
        creator: address,
        name: String,
        symbol: String,
        entry_price: u64,
        treasury: Balance<SUI>,
        members_count: u64,
        total_supply: u64,
        is_active: bool,
    }

    // ========== ERRORS ========== 
    const EInsufficientPayment: u64 = 1;
    const ECircleInactive: u64 = 2;
    const EPlatformFeeTooHigh: u64 = 3;
    const EUnauthorized: u64 = 99;

    // ========== INIT ========== 
    fun init(witness: CIRCLE_TOKEN, ctx: &mut TxContext) {
        let registry = CircleRegistry {
            id: object::new(ctx),
            circles: vector::empty(),
        };
        transfer::share_object(registry);
    }

    // ========== PUBLIC FUNCTIONS ========== 
    /// Cria novo círculo (retorna TreasuryCap privado)
    public fun create_circle(
        registry: &mut CircleRegistry,
        name: vector<u8>,
        symbol: vector<u8>,
        entry_price: u64,
        initial_supply: u64,
        ctx: &mut TxContext
    ): TreasuryCap<CIRCLE_TOKEN> {
        let creator = tx_context::sender(ctx);

        // Cria currency
        let (treasury, metadata) = coin::create_currency(
            CIRCLE_TOKEN {},
            9, // decimals
            symbol,
            name,
            b"CreatorCircles Token",
            option::none(),
            ctx
        );

        // Cria circle shared object
        let circle_uid = object::new(ctx);
        let circle_id = object::uid_to_inner(&circle_uid);

        let circle = Circle {
            id: circle_uid,
            creator,
            name: string::utf8(name),
            symbol: string::utf8(symbol),
            entry_price,
            treasury: balance::zero(),
            members_count: 0,
            total_supply: initial_supply,
            is_active: true,
        };

        // Registra no registry
        vector::push_back(&mut registry.circles, circle_id);

        // Congela metadata (imutável)
        transfer::public_freeze_object(metadata);

        // Compartilha circle
        transfer::share_object(circle);

        // Retorna treasury para criador gerenciar
        treasury
    }

    /// Compra tokens (usuário paga em SUI)
    public entry fun buy_tokens(
        circle: &mut Circle,
        treasury: &mut TreasuryCap<CIRCLE_TOKEN>,
        payment: Coin<SUI>,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(circle.is_active, ECircleInactive);

        let buyer = tx_context::sender(ctx);
        let required_sui = circle.entry_price * amount;

        assert!(coin::value(&payment) >= required_sui, EInsufficientPayment);

        // Split payment: 90% criador, 10% plataforma
        let payment_value = coin::value(&payment);
        let platform_fee = payment_value / 10; // 10%
        let creator_share = payment_value - platform_fee;

        // Converte para balance
        let payment_balance = coin::into_balance(payment);
        let platform_balance = balance::split(&mut payment_balance, platform_fee);

        // Deposita no treasury do circle
        balance::join(&mut circle.treasury, payment_balance);

        // Transfere fee para plataforma
        transfer::public_transfer(
            coin::from_balance(platform_balance, ctx),
            @0xPLATFORM_ADDRESS // Endereço real da plataforma
        );

        // Mint tokens para comprador
        let tokens = coin::mint(treasury, amount, ctx);
        transfer::public_transfer(tokens, buyer);

        // Atualiza contadores
        circle.members_count = circle.members_count + 1;

        // Emite evento
        sui::event::emit(TokensPurchased {
            circle_id: object::id(circle),
            buyer,
            amount,
            price_paid: required_sui,
        });
    }

    // ========== ADMIN FUNCTIONS ========== 
    /// Saca fundos do treasury (apenas criador)
    public entry fun withdraw_treasury(
        circle: &mut Circle,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == circle.creator, EUnauthorized);

        let withdrawn = coin::from_balance(
            balance::split(&mut circle.treasury, amount),
            ctx
        );
        transfer::public_transfer(withdrawn, sender);
    }

    // ========== EVENTS ========== 
    struct TokensPurchased has copy, drop {
        circle_id: ID,
        buyer: address,
        amount: u64,
        price_paid: u64,
    }
}
