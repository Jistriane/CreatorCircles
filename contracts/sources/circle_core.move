// circle_core.move — Core logic + Object Wrapping
// Implementa objeto principal do círculo, governança, tesouraria e membros

module creator_circles::circle_core {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::dynamic_field as df;
    use sui::event;
    use std::string::{Self, String, utf8};
    use std::vector;

    // ========== ERROR CODES ========== 
    const EInsufficientPayment: u64 = 1;
    const EUnauthorized: u64 = 2;
    const ECirclePaused: u64 = 3;
    const EMaxMembersReached: u64 = 4;

    // ========== CORE STRUCTS ========== 
    struct Circle has key, store {
        id: UID,
        creator: address,
        metadata: CircleMetadata,
        treasury: Balance<SUI>,
        members: vector<address>,
        config: CircleConfig,
        is_paused: bool,
    }

    struct CircleMetadata has store, copy, drop {
        name: String,
        symbol: String,
        description: String,
        image_url: String,
        circle_type: u8, // 1=Creator, 2=Collector, 3=DAO
    }

    struct CircleConfig has store, copy, drop {
        entry_price: u64, // em MIST
        max_members: u64,
        royalty_rate: u8, // 5% = 5
        platform_fee: u8, // 10% = 10
        creator_share: u8, // 70% = 70
        member_share: u8, // 20% = 20
    }

    // ========== ADMIN CAP ========== 
    struct AdminCap has key, store {
        id: UID,
        circle_id: ID,
    }

    // ========== EVENTOS ========== 
    struct CircleCreated has copy, drop {
        circle_id: ID,
        creator: address,
        name: String,
        entry_price: u64,
        timestamp: u64,
    }

    struct MemberJoined has copy, drop {
        circle_id: ID,
        member: address,
        payment_amount: u64,
        total_members: u64,
    }

    // ========== FUNÇÕES PÚBLICAS ========== 
    /// Cria novo círculo (retorna AdminCap)
    public fun create_circle(
        name: vector<u8>,
        symbol: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        entry_price: u64,
        max_members: u64,
        ctx: &mut TxContext
    ): AdminCap {
        let creator = tx_context::sender(ctx);
        let circle_uid = object::new(ctx);
        let circle_id = object::uid_to_inner(&circle_uid);
        let metadata = CircleMetadata {
            name: utf8(name),
            symbol: utf8(symbol),
            description: utf8(description),
            image_url: utf8(image_url),
            circle_type: 1,
        };
        let config = CircleConfig {
            entry_price,
            max_members,
            royalty_rate: 5,
            platform_fee: 10,
            creator_share: 70,
            member_share: 20,
        };
        let circle = Circle {
            id: circle_uid,
            creator,
            metadata,
            treasury: balance::zero(),
            members: vector::empty(),
            config,
            is_paused: false,
        };
        event::emit(CircleCreated {
            circle_id,
            creator,
            name: metadata.name,
            entry_price,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
        });
        transfer::share_object(circle);
        AdminCap {
            id: object::new(ctx),
            circle_id,
        }
    }

    /// Join circle (paga entry fee)
    public fun join_circle(
        circle: &mut Circle,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let member = tx_context::sender(ctx);
        assert!(!circle.is_paused, ECirclePaused);
        assert!(vector::length(&circle.members) < circle.config.max_members, EMaxMembersReached);
        assert!(coin::value(&payment) >= circle.config.entry_price, EInsufficientPayment);
        let total_value = coin::value(&payment);
        let creator_amount = (total_value * (circle.config.creator_share as u64)) / 100;
        let platform_amount = (total_value * (circle.config.platform_fee as u64)) / 100;
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut circle.treasury, payment_balance);
        vector::push_back(&mut circle.members, member);
        event::emit(MemberJoined {
            circle_id: object::id(circle),
            member,
            payment_amount: total_value,
            total_members: vector::length(&circle.members),
        });
        // Trigger mint de NFT (via dynamic call)
        // access_nft::mint_membership(circle, member, ctx);
    }

    // ========== ADMIN FUNCTIONS ========== 
    /// Pausa círculo (emergência)
    public fun pause_circle(
        _admin_cap: &AdminCap,
        circle: &mut Circle,
        _ctx: &mut TxContext
    ) {
        circle.is_paused = true;
    }

    /// Retira fundos do treasury
    public fun withdraw_treasury(
        admin_cap: &AdminCap,
        circle: &mut Circle,
        amount: u64,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(admin_cap.circle_id == object::id(circle), EUnauthorized);
        coin::from_balance(balance::split(&mut circle.treasury, amount), ctx)
    }

    // ========== VIEW FUNCTIONS ========== 
    public fun get_members_count(circle: &Circle): u64 {
        vector::length(&circle.members)
    }
    public fun get_treasury_balance(circle: &Circle): u64 {
        balance::value(&circle.treasury)
    }
    public fun is_member(circle: &Circle, addr: address): bool {
        vector::contains(&circle.members, &addr)
    }
}
