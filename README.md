
# CreatorCircles

## Arquitetura de Alto Nível

O CreatorCircles é composto por três grandes camadas:

- **Frontend:** Next.js (React + TypeScript) hospedado no Vercel. Páginas públicas, dashboard do criador, portal do membro e integração com WAL Wallet.
- **Backend:** Node.js + TypeScript (Express) hospedado em Render/Railway. API Gateway, autenticação, Event Syncer (consome eventos Sui e atualiza MongoDB), Reward Distributor (emissão de NFTs/benefícios).
- **Blockchain:** Sui (devnet/prod) com contratos Move em `contracts/` para tokens, NFTs, vault e governança.
- **DB:** MongoDB Atlas (cluster gerenciado).
- **Observability:** Sentry + logs estruturados (Logtail/BetterStack).



### Componentes principais

- **API Gateway / Backend**
  - Autenticação via WAL, sessão JWT curta.
  - CRUD de círculos, integração com contratos Move.
  - Event Syncer: atualiza MongoDB com eventos on-chain.
  - Reward Distributor: distribui NFTs e benefícios.
- **Frontend (Next.js)**
  - Explorar círculos, detalhes, dashboard, governança, mercado secundário.
  - Login WAL, assinatura de transações on-chain.
- **Contracts (Move)**
  - `circle_factory`, `circle_token`, `access_nft`, `circle_vault`.

### Fluxos críticos

- **Compra de tokens:**
  1. Frontend solicita wal.signTransaction(txBytes)
  2. Usuário assina e tx é enviada para Sui
  3. Event Syncer consome evento TokensPurchased e atualiza MongoDB
  4. Backend emite NFT ou atualiza saldo do usuário

- **Governança:**
  1. Proposta criada via backend (validação de stake)
  2. Votação on-chain (ou off-chain com assinatura)
  3. Execução automática se aprovadas

### Segurança

- Backend nunca armazena chaves privadas.
- Transações críticas requerem assinatura do usuário via WAL.
- Rate limit e validação estrita de inputs.
- Segredos em variáveis de ambiente.

### Escalabilidade

- API stateless, escalável horizontalmente.
- Event Syncer particionado por blocos/eventos.
- MongoDB com índices para wallet, circleId, eventHash.

### Observabilidade

- Logs estruturados (JSON) com requestId.
- Métricas: eventos on-chain, latência, erros 5xx.
- Alertas: Sentry + regras de erro crítico.

---
![Creator Circles Logo](./packages/frontend/public/logo.svg)


## Visão Geral

CreatorCircles é uma plataforma completa para gestão de círculos de criadores, com contratos Sui Move, backend Node.js e frontend Next.js. Permite criar comunidades, emitir tokens, NFTs de acesso, gerenciar governança e recompensas on-chain.


## Estrutura

- **contracts/**: Módulos Move para lógica de tokens, NFTs, vault e governança.
- **packages/backend/**: API Node.js integrada ao Sui via REST.
- **packages/frontend/**: Interface Next.js para explorar, criar e gerenciar círculos, com dashboard, marketplace e governança.


## Como rodar localmente


1. Instale as dependências:

  ```bash
  npm install
  ```

2. Inicie o backend:

  ```bash
  cd packages/backend
  npm run dev
  ```

3. Inicie o frontend:

  ```bash
  cd packages/frontend
  npm run dev
  ```


## Integração Sui

- O backend consulta dados do Sui via REST (RPC público ou local).
- Para testes, ajuste a variável `BUYER` para um endereço Sui válido.
- Os contratos Move estão publicados na mainnet e podem ser acessados via Sui CLI ou SDK.


## Deploy

- **Frontend Vercel:** [https://frontend-ah38la9br-jistrianedroid-3423s-projects.vercel.app](https://frontend-ah38la9br-jistrianedroid-3423s-projects.vercel.app)
- **Backend Vercel:** [https://backend-5o8kmvuxk-jistrianedroid-3423s-projects.vercel.app](https://backend-5o8kmvuxk-jistrianedroid-3423s-projects.vercel.app)
- Configure variáveis de ambiente conforme `.env.example` em cada pacote.
- O frontend usa `NEXT_PUBLIC_API_URL` para apontar para o backend.


## Contratos Move (Mainnet)

- **Data do deploy:** 16/11/2025
- **Endereço do deployer:** `0x98282be3b00463a9b2abc1a887b9e0c91d6bebb58797f795444b2ddb17f04bfc`
- **PackageId publicado:** `0xa3ab904db4e864739b2c549f48c7f013ef6a09e9f0b4a64320898e57e7926806`
- **Módulos Move publicados:**
  - access_nft
  - circle_factory
  - circle_token
  - circle_token_coin_flow
  - circle_token_impl
  - circle_vault
  - coin_balance_publisher
  - coin_flow_full_test
  - coin_flow_test
  - integration_test

### Como interagir com os contratos

- Utilize o Sui CLI ou SDK para interagir com os módulos publicados.
- Exemplo de chamada:


  ```bash
  sui client call --package 0xa3ab904db4e864739b2c549f48c7f013ef6a09e9f0b4a64320898e57e7926806 --module circle_factory --function <função> --args ...
  ```
- Consulte a documentação dos módulos para detalhes de cada função.


### Observações

- Os contratos estão ativos na mainnet Sui.
- Para upgrades, utilize o objeto UpgradeCap gerado no deploy.
- O backend pode ser configurado para consumir dados diretamente da mainnet usando o PackageId acima.


## Funcionalidades

- Criação de círculos com tokens e NFTs de acesso
- Marketplace de círculos com filtros e badges
- Dashboard do criador com analytics e ações rápidas
- Governança on-chain e propostas
- Configurações avançadas para criadores
- Integração com wallets Sui


## Wireframes e Arquitetura

Consulte o arquivo `Arquitetura completa CreatorCircles.md` para detalhes visuais e funcionais das telas principais.

## Links Úteis

- [Documentação WAL Wallet](https://docs.wal.app/)
- [SDK Sui Typescript](https://sdk.mystenlabs.com/typescript)
- [Guia Sui Oficial](https://docs.sui.io/guides)
- [Comandos Sui Move](https://github.com/gustavo-f0ntz/SUI-Comandos---Essenciais/blob/main/docs/comandos-completos.md)

---

Dúvidas ou sugestões? Abra uma issue ou entre em contato com [Jistriane](mailto:jistriane@exemplo.com)
