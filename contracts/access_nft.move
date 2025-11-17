// access_nft.move
// NFT de acesso e royalties — esboço inicial
module creator_circles::access_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::String;
    use std::vector;

    struct AccessNFT has key, store {
        id: UID,
        circle_id: String,
        member_address: address,
        benefits: vector<String>,
        join_date: u64,
        royalties_rate: u8
    }

    struct AccessGranted has copy, drop {
        member: address,
        circle_id: String,
        benefits: vector<String>
    }

    // Mint básico de NFT de acesso
    public entry fun mint_access_nft(
        circle_id: String,
        member: address,
        benefits: vector<String>,
        ctx: &mut TxContext
    ) {
        let nft = AccessNFT {
            id: object::new(ctx),
            circle_id,
            member_address: member,
            benefits: benefits,
            join_date: tx_context::epoch(ctx),
            royalties_rate: 5u8
        };

        transfer::public_transfer(nft, member);

        event::emit(AccessGranted { member, circle_id: nft.circle_id, benefits: nft.benefits });
    }

    // Distribuição de royalties (esboço): será chamada por um flow de venda secundária
    public entry fun distribute_royalties(nft: &mut AccessNFT, sale_amount: u64, seller: address, ctx: &mut TxContext) {
        let royalty = sale_amount * (nft.royalties_rate as u64) / 100u64;
        // Split: 70% criador, 20% membro, 10% plataforma — placeholder
        // Implementar transferências usando coin::transfer
    }
}
