# Exemplo de teste Move (instruções)

Este arquivo contém um exemplo didático de como escrever um teste Move para os módulos em `contracts/sources/`.

Observações:
- Os exemplos abaixo são apenas para guiar a implementação. Não são executados pelo NPM diretamente.
- Use `sui move test` no diretório `contracts` para executar testes Move quando o `sui` estiver instalado.

Exemplo (esqueleto) de teste Move — adicione em um arquivo `.move` sob `contracts/sources/`:

```move
module tests::circle_token_test {
    use sui::tx_context::TxContext;
    use sui::test;

    #[test]
    fun test_create_circle() {
        // Arrange: preparar um contexto/taker (dependente do framework de testes do Sui)
        // Act: chamar creator_circles::circle_factory::create_circle(...)
        // Assert: verificar que objetos foram criados e que a supply inicial pertence ao criador
    }
}
```

Passos rápidos para executar testes localmente:

```bash
cd contracts
sui move check
sui move test
```

Se `sui` não estiver instalado localmente, siga as instruções em `contracts/README.md`.
