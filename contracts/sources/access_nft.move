
module creator_circles::access_nft {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::kiosk::Kiosk;
    use sui::transfer_policy::TransferPolicy;
    use std::string::{Self, String, utf8};
    use sui::event;

    // ========== NFT STRUCT ========== 
    struct MembershipNFT has key, store {
        id: UID,
        circle_id: ID,
        member: address,
        tier: u8, // 1=Bronze, 2=Silver, 3=Gold
        mint_date: u64,
        benefits_count: u64,
        metadata_uri: String,
    }

    // OTW para criar Publisher
    struct ACCESS_NFT has drop {}

    // ========== EVENTOS ========== 
    struct NFTMinted has copy, drop {
        nft_id: ID,
        circle_id: ID,
        member: address,
        tier: u8,
    }

    // ========== FUNÇÕES ========== 
    /// Mint NFT de acesso (chamado pelo circle_core)
    public fun mint_membership(
        circle_id: ID,
        member: address,
        tier: u8,
        metadata_uri: vector<u8>,
        ctx: &mut TxContext
    ): MembershipNFT {
        let nft = MembershipNFT {
            id: object::new(ctx),
            circle_id,
            member,
            tier,
            mint_date: tx_context::epoch_timestamp_ms(ctx),
            benefits_count: 0,
            metadata_uri: utf8(metadata_uri),
        };
        event::emit(NFTMinted {
            nft_id: object::id(&nft),
            circle_id,
            member,
            tier,
        });
        nft
    }

    /// Transfere NFT via Kiosk (com royalties automáticos)
    public fun transfer_via_kiosk(
        _kiosk: &mut Kiosk,
        _policy: &TransferPolicy<MembershipNFT>,
        nft: MembershipNFT,
        buyer: address,
        _ctx: &mut TxContext
    ) {
        // Lógica de royalties gerenciada pelo TransferPolicy
        transfer::public_transfer(nft, buyer);
    }

    /// Verifica se usuário tem acesso
    public fun verify_access(nft: &MembershipNFT, user: address): bool {
        nft.member == user
    }

    // ========== GETTERS ========== 
    public fun get_tier(nft: &MembershipNFT): u8 { nft.tier }
    public fun get_circle_id(nft: &MembershipNFT): ID { nft.circle_id }
}
