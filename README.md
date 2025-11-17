![Creator Circles Logo](./packages/frontend/public/logo-creatorcircles.png)

# CreatorCircles

## Visão Geral

Projeto fullstack para gestão de círculos de criadores, com contratos Sui Move, backend Node.js e frontend Next.js.

## Estrutura

- **contracts/**: Módulos Move para lógica de tokens e círculos.

- **packages/backend/**: API Node.js integrada ao Sui via REST.

- **packages/frontend/**: Interface Next.js para explorar e gerenciar círculos.

## Como rodar

1. Instale dependências:

```bash
npm install
```

2. Backend:

```bash
cd packages/backend
npm run sui-sdk-test # Testa integração com Sui
npm run dev         # Inicia API
```

3. Frontend:

```bash
cd packages/frontend
npm run dev         # Inicia interface web
```

## Integração Sui

- O backend consulta dados do Sui via REST (RPC público ou local).
- Para testes, ajuste a variável `BUYER` para um endereço Sui válido.

## Deploy
## Deploys em Produção

- **Frontend Vercel:** [https://frontend-ah38la9br-jistrianedroid-3423s-projects.vercel.app](https://frontend-ah38la9br-jistrianedroid-3423s-projects.vercel.app)
- **Backend Vercel:** [https://backend-5o8kmvuxk-jistrianedroid-3423s-projects.vercel.app](https://backend-5o8kmvuxk-jistrianedroid-3423s-projects.vercel.app)
- Configure variáveis de ambiente conforme `.env.example` em cada pacote.
- O frontend usa `NEXT_PUBLIC_API_URL` para apontar para o backend.

## Deploy dos Contratos Move (Mainnet)

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

## Roadmap

- [x] Contratos Move
- [x] Backend integrado
- [x] Frontend básico
- [ ] Funcionalidades interativas (compra, saldo, etc)
- [ ] Documentação detalhada

---

Dúvidas ou sugestões? Abra uma issue!
