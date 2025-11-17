# Contracts tests and local checks

This folder contains guidance and examples for testing Move contracts locally. It does not contain runnable JS tests — Move tests are executed with the Sui toolchain.

## Prerequisites

- Install Sui CLI: [Sui docs](https://docs.sui.io/guides)
- Ensure `sui` is in your PATH.

## Local workflow

1. From the repository root:

```bash
cd contracts
npm run move:check
```

2. Run Move unit tests (if you add any Move test files):

```bash
npm run move:test
```

3. To publish to testnet (requires configured keystore and funds):

```bash
npm run move:publish:testnet
```

4. To publish to mainnet (ONLY after audit and when ready):

```bash
npm run move:publish:mainnet
# or use the helper: ./deploy.sh mainnet
```

## Notes

- Keep keystore secrets out of the repository. Use CI secrets or manual keystore configuration.
- The CI includes a manual `Publish Move` workflow to run publish from a runner with keystore provided as a secret.
