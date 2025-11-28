// governance.move — Governança com weighted/quadratic voting
// Permite propostas, votos ponderados por tokens, e timelock

module creator_circles::governance {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::{Self, String, utf8};
    use std::vector;

    /// Proposta de governança
    struct Proposal has key {
        id: UID,
        circle_id: ID,
        creator: address,
        description: String,
        start_time: u64,
        end_time: u64,
        executed: bool,
        votes_for: u64,
        votes_against: u64,
    }

    /// Voto individual
    struct Vote has key {
        id: UID,
        proposal_id: ID,
        voter: address,
        weight: u64,
        support: bool, // true = for, false = against
    }

    /// Evento de proposta criada
    struct ProposalCreated has copy, drop {
        proposal_id: ID,
        circle_id: ID,
        creator: address,
        description: String,
        start_time: u64,
        end_time: u64,
    }

    /// Evento de voto
    struct VoteCast has copy, drop {
        proposal_id: ID,
        voter: address,
        weight: u64,
        support: bool,
    }

    /// Cria nova proposta
    public fun create_proposal(
        circle_id: ID,
        creator: address,
        description: vector<u8>,
        start_time: u64,
        end_time: u64,
        ctx: &mut TxContext
    ): Proposal {
        let proposal = Proposal {
            id: object::new(ctx),
            circle_id,
            creator,
            description: utf8(description),
            start_time,
            end_time,
            executed: false,
            votes_for: 0,
            votes_against: 0,
        };
        event::emit(ProposalCreated {
            proposal_id: object::id(&proposal),
            circle_id,
            creator,
            description: utf8(description),
            start_time,
            end_time,
        });
        proposal
    }

    /// Vota em uma proposta (weighted/quadratic)
    public fun cast_vote(
        proposal: &mut Proposal,
        voter: address,
        token_balance: u64,
        support: bool,
        ctx: &mut TxContext
    ) {
        // Quadratic voting: peso = sqrt(balance)
        let weight = sqrt(token_balance);
        let vote = Vote {
            id: object::new(ctx),
            proposal_id: object::id(proposal),
            voter,
            weight,
            support,
        };
        if (support) {
            proposal.votes_for = proposal.votes_for + weight;
        } else {
            proposal.votes_against = proposal.votes_against + weight;
        }
        event::emit(VoteCast {
            proposal_id: object::id(proposal),
            voter,
            weight,
            support,
        });
    }

    /// Executa proposta se aprovada e timelock expirado
    public fun execute_proposal(
        proposal: &mut Proposal,
        current_time: u64
    ) {
        assert!(!proposal.executed, 1);
        assert!(current_time >= proposal.end_time, 2);
        assert!(proposal.votes_for > proposal.votes_against, 3);
        proposal.executed = true;
        // TODO: lógica de execução customizada
    }

    /// Raiz quadrada inteira
    fun sqrt(x: u64): u64 {
        let mut z = x;
        let mut res = 0u64;
        while (z > 0) {
            z = z / 2;
            res = res + 1;
        }
        res
    }
}
