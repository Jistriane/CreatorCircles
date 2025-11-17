// circle_factory.move
// Factory para deploy de novos círculos (esboço)
module creator_circles::circle_factory {
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use std::string::String;
    use sui::transfer;

    struct Factory has key, store {
        id: UID,
        owner: address,
        factory_version: u64
    }

    // Deploy inicial do factory
    public entry fun init_factory(ctx: &mut TxContext) {
        let owner = tx_context::sender(ctx);
        let f = Factory { id: object::new(ctx), owner, factory_version: 1 };
        transfer::public_transfer(f, owner);
    }

    // Função que o criador chama para criar um novo circle (esboço)
    public entry fun create_circle(ctx: &mut TxContext, name: String, symbol: String, initial_supply: u64, entry_price: u64) {
        let creator = tx_context::sender(ctx);
        // Internamente chamaria circle_token::create_circle_token e circle_vault::create_vault
        // Implementar cross-module calls e transferências apropriadas
    }
}
