# Arquitetura de Alto Nível — CreatorCircles

Este documento descreve a arquitetura inicial recomendada para o projeto.

Visão geral

- Frontend: Next.js (React + TypeScript) hospedado no Vercel.
- Backend: Node.js + TypeScript (Express) hospedado em Render/Railway.
- Blockchain: Sui (devnet/prod) com contratos Move em `contracts/`.
- Wallet/Auth: Wal SDK para autenticação e assinatura de transações.
- DB: MongoDB Atlas (cluster gerenciado).
- Observability: Sentry + logs estruturados (Logtail/BetterStack).

Componentes

- API Gateway / Backend
  - Autenticação: valida sessionToken da Wal e gera sessão JWT curta.
  - Circle Manager: endpoints CRUD para circles, integração com contracts e vault.
  - Event Syncer: worker que consome eventos Sui via `@mysten/sui.js` e atualiza o MongoDB.
  - Reward Distributor: serviço assíncrono que emite NFTs/benefícios.

- Frontend (Next.js)
  - Páginas públicas: explorar círculos, página de detalhe.
  - Área autenticada: dashboard do criador, portal do membro, mercado secundário.
  - Integração com Wal: login via wal.connect() e assinatura cliente para tx on-chain.

- Contracts (Move)
  - `creator_circles::circle_factory` — deploy inicial de novos círculos.
  - `creator_circles::circle_token` — token fungível do círculo.
  - `creator_circles::access_nft` — NFT de acesso e royalties.
  - `creator_circles::circle_vault` — tesouro, splits e governança.

Modelo de dados (resumido)

- circles
  - _id, contractAddress, creator, tokenSymbol, memberCount, totalRevenueSUI, benefits, governanceParams

- users
  - wallet, circlesJoined [{symbol, tokens, joinDate}], nftAccess

- events (off-chain index)
  - eventHash, type, circleId, txHash, payload, processedAt

Fluxos críticos

- Compra de tokens:
  1. Frontend solicita wal.signTransaction(txBytes)
  2. Usuário assina e tx é enviada para Sui
  3. Event Syncer consome evento TokensPurchased e atualiza MongoDB
  4. Backend emite NFT ou atualiza saldo do usuário

- Governança:
  1. Proposta criada via backend (validação de stake)
  2. Votação on-chain (ou off-chain com assinatura) – resultados armazenados no contracts + DB
  3. Execução automática se aprovadas

Considerações de segurança

- Backend nunca armazena chaves privadas.
- Todas as transações críticas requerem assinatura do usuário via Wal.
- Rate limit em endpoints sensíveis e validação estrita de inputs.
- Segredos em variáveis de ambiente e gerenciador (Vault/Secrets Manager).

Escalabilidade

- API stateless; escalar horizontalmente por replicas.
- Event Syncer particionado por ranges de blocos/event types.
- MongoDB com índices para `wallet`, `circleId`, `eventHash`.

Observabilidade

- Logs estruturados (JSON) com requestId.
- Métricas: contadores de eventos on-chain, latência de compra, erros 5xx.
- Alertas: Sentry + regras de erro crítico.

Próximos passos técnicos

1. Formalizar contratos Move e rodar `sui move check` localmente.
2. Implementar Event Syncer com `@mysten/sui.js`.
3. Desenvolver API de integração Wal (endpoints /auth/verify, /auth/callback).

