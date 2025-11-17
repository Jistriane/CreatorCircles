// circle_factory.move — factory to create circles and wire modules together (sketch)
// Purpose: single entrypoint to create a new Circle: token, vault and initial configuration.

module creator_circles::circle_factory {
    use std::string::String;

    // Create a circle by calling the token and vault modules.
    // Implementation checklist:
    //  - create token metadata + initial mint
    //  - create vault and set ownership/governance params
    //  - return references/ids to created objects for indexing off-chain
    public fun create_circle(/* params, ctx */) {
        // TODO: orchestrate `circle_token::create_circle_token` and `circle_vault::create_vault`.
    }
}
