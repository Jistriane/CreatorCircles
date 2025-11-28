# CreatorCircles — Módulos Move

Este diretório contém os módulos Move do projeto CreatorCircles, seguindo as melhores práticas Sui Mainnet-ready.

## Estrutura

- `circle_core.move`: Lógica principal do círculo, tesouraria, membros, governança.
- `circle_token.move`: Token fungível padrão Sui Coin, shared object.
- `access_nft.move`: NFT de acesso, compatível com Kiosk Protocol.
- `liquidity_pool.move`: AMM básico para liquidez dos tokens.
- `governance.move`: Governança com weighted/quadratic voting.
- `royalty_engine.move`: Engine de royalties on-chain.
- `events.move`: Eventos customizados para indexação.
- `circle_factory.move`: Orquestração de criação de círculos e registro dinâmico.
- `Move.toml`: Configuração do pacote Move.

## Padrões Sui

- Uso de Shared Objects
- Dynamic Fields para metadados/configs
- Eventos detalhados para indexação
- Integração com Kiosk Protocol e TransferPolicy
- Segurança, modularidade e extensibilidade

## Como compilar/testar

```bash
sui move build
sui move test
```

## Auditoria

Recomenda-se auditoria externa antes do deploy mainnet.

## Links Úteis

- [Guia Sui Oficial](https://docs.sui.io/guides)
- [SDK Sui Typescript](https://sdk.mystenlabs.com/typescript)
- [Documentação WAL Wallet](https://docs.wal.app/)
- [Comandos Sui Move](https://github.com/gustavo-f0ntz/SUI-Comandos---Essenciais/blob/main/docs/comandos-completos.md)
