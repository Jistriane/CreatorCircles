# CreatorCircles Frontend

Este projeto é o frontend do CreatorCircles, desenvolvido com Next.js + TypeScript, integrado ao Sui via dApp Kit e WAL Wallet.

## Funcionalidades

- Explorar, criar e gerenciar círculos
- Dashboard do criador com analytics
- Marketplace de círculos
- Governança on-chain
- Integração WAL Wallet e Sui dApp Kit
- Internacionalização (i18n)
- Tema escuro/claro
- Health check API
- Templates legais (ToS, Privacy Policy, Utility Statement)

## Deploy

Deploy automático via Vercel. Projeto vinculado ao escopo `jistrianedroid-3423s-projects`.

🔗 [Acesse o frontend em produção](https://frontend-jistrianedroid-3423s-projects.vercel.app/)

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura

- `pages/` - Páginas Next.js
- `components/` - Componentes reutilizáveis
- `hooks/` - Hooks customizados (ex: useCreateCircle)
- `services/` - Integrações GraphQL, Oracle, etc
- `public/` - Arquivos estáticos e templates legais
- `styles/` - Estilos CSS e tema

## Observações

- Variáveis de ambiente sensíveis devem ser configuradas na dashboard Vercel
- O frontend usa `NEXT_PUBLIC_API_URL` para apontar para o backend

## Links Úteis

- [Documentação WAL Wallet](https://docs.wal.app/)
- [SDK Sui Typescript](https://sdk.mystenlabs.com/typescript)
- [Guia Sui Oficial](https://docs.sui.io/guides)

## Contato

Dúvidas ou sugestões: [Jistriane](mailto:jistriane@exemplo.com)
