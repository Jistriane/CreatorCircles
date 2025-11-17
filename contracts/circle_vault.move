// circle_vault.move
// Vault central do Circle, split de receitas e funções de governança (esboço)
module creator_circles::circle_vault {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::String;
    use std::vector;

    struct Vault has key, store {
        id: UID,
        circle_id: String,
        creator: address,
        balance_sui: u64
    }

    struct GovernanceProposal has key, store {
        id: UID,
        title: String,
        description: String,
        proposer: address,
        yes_votes: u64,
        no_votes: u64,
        start_epoch: u64,
        end_epoch: u64
    }

    // Cria vault inicial para o circle
    public entry fun create_vault(circle_id: String, creator: address, ctx: &mut TxContext) {
        let v = Vault { id: object::new(ctx), circle_id, creator, balance_sui: 0u64 };
        transfer::public_transfer(v, creator);
    }

    // Recebe fundos (esboço): caller transfere SUI e atualização do balance
    public entry fun deposit(vault: &mut Vault, amount: u64, ctx: &mut TxContext) {
        vault.balance_sui = vault.balance_sui + amount;
    }

    // Cria proposta de governança (esboço)
    public entry fun create_proposal(title: String, description: String, proposer: address, duration_epochs: u64, ctx: &mut TxContext) {
        let p = GovernanceProposal {
            id: object::new(ctx),
            title,
            description,
            proposer,
            yes_votes: 0u64,
            no_votes: 0u64,
            start_epoch: tx_context::epoch(ctx),
            end_epoch: tx_context::epoch(ctx) + duration_epochs
        };
        // armazenamento e transferência do objeto de proposta fica a implementar
    }
}
