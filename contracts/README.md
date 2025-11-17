Contracts Move — instruções rápidas

Este diretório contém esboços iniciais dos módulos Move para CreatorCircles.

Requisitos locais
- Instale a Sui CLI: https://docs.sui.io/guides
- Tenha o `sui` e `sui move` disponíveis no PATH.

Checagem e testes básicos
- Rodar checagem de tipos e módulos:

```bash
cd contracts
sui move check
```

- Para testes Move (se existir um test harness):

```bash
sui move test
```

Nota: o repositório já fornece um script de conveniência. Se o `sui` não estiver instalado localmente você pode usar o instalador oficial (Linux/macOS):

```bash
curl -sSL https://get.sui.io | bash
# depois atualize o PATH: export PATH="$HOME/.sui/bin:$PATH"
cd contracts
npm run move:check
```

Security & mainnet checklist
- Audit contracts thoroughly before publishing to mainnet.
- Prepare a funded Sui account and keep backups of keystore off-repo.
- Use the `contracts/deploy.sh` script or the `Publish Move` manual workflow in `.github/workflows/publish-move.yml`.
- Do a dry-run on testnet and review transaction digests.


Notas
- Os arquivos aqui são esboços iniciais e precisam de auditoria antes de deploy.
- Proponha integrar `sui` no CI se desejar executar `sui move check` em PRs.
