// royalty_engine.move — Engine de royalties on-chain para Circle NFTs

module creator_circles::royalty_engine {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::{Self, String, utf8};

    /// Configuração de royalties
    struct RoyaltyConfig has key {
        id: UID,
        circle_id: ID,
        royalty_rate: u8, // %
        platform_fee: u8, // %
        creator_address: address,
    }

    /// Evento de pagamento de royalties
    struct RoyaltyPaid has copy, drop {
        circle_id: ID,
        payer: address,
        amount: u64,
        royalty_amount: u64,
        platform_amount: u64,
        creator: address,
    }

    /// Calcula e distribui royalties
    public fun pay_royalty(
        config: &RoyaltyConfig,
        payer: address,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let royalty_amount = (amount * (config.royalty_rate as u64)) / 100;
        let platform_amount = (amount * (config.platform_fee as u64)) / 100;
        let creator_amount = amount - royalty_amount - platform_amount;
        // TODO: transferir valores para criador e plataforma
        event::emit(RoyaltyPaid {
            circle_id: config.circle_id,
            payer,
            amount,
            royalty_amount,
            platform_amount,
            creator: config.creator_address,
        });
    }
}
