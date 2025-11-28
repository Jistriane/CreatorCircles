// circle_factory.move — factory to create circles and wire modules together (sketch)
// Purpose: single entrypoint to create a new Circle: token, vault and initial configuration.


module creator_circles::circle_factory {
    use sui::object::{UID, ID};
    use sui::tx_context::TxContext;
    use sui::dynamic_field as df;
    use std::string::utf8;
    use std::vector;
    use creator_circles::circle_token;
    use creator_circles::circle_vault;

    /// Estrutura para registro dinâmico de círculos
    struct CircleRegistry has key {
        id: UID,
        circles: vector<ID>,
    }

    /// Cria um novo círculo, token e vault, e registra dados dinâmicos
    public fun create_circle(
        registry: &mut CircleRegistry,
        name: vector<u8>,
        symbol: vector<u8>,
        entry_price: u64,
        initial_supply: u64,
        ctx: &mut TxContext
    ) {
        // Cria token (ajuste: não passa registry se não for esperado)
        let _treasury = circle_token::create_circle(
            registry,
            name,
            symbol,
            entry_price,
            initial_supply,
            ctx
        );

        // Cria vault para o círculo (ajuste: sem argumentos se esperado)
        let _vault_id = circle_vault::create_vault();

        // Registra dados dinâmicos do círculo
        let _circle_id = vector::back(&registry.circles);
        let metadata = utf8(name);
        df::add(&mut registry.id, b"circle_metadata", metadata);
        // TODO: registrar vault_id se tipo for compatível
        // TODO: emitir evento CircleCreated com _circle_id, _vault_id
    }
}
