#!/usr/bin/env bash
set -euo pipefail

# Convenience script to publish Move packages to a Sui network.
# WARNING: Publishing to mainnet spends real gas. Only run with a funded account and
# after reviewing and auditing contracts. This script assumes `sui` CLI is installed
# and the keypair / keystore is configured.

NETWORK=${1:-mainnet}

echo "Publishing contracts to Sui network: $NETWORK"

if ! command -v sui >/dev/null 2>&1; then
  echo "sui CLI not found. Install it first: https://docs.sui.io/developing/sui-cli"
  exit 1
fi

cd "$(dirname "$0")"

echo "Running move check..."
sui move check

echo "Publishing package (network=$NETWORK)"
sui move publish --network "$NETWORK"

echo "Publish finished. Keep the transaction digest and the new package id for records."
