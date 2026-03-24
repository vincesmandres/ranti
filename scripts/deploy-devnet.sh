#!/usr/bin/env bash
set -euo pipefail

if ! command -v solana >/dev/null 2>&1; then
  echo "[BLOCKED] solana CLI no está instalada."
  echo "Instala Solana CLI: https://solana.com/docs/intro/installation"
  exit 1
fi

if ! command -v anchor >/dev/null 2>&1; then
  echo "[BLOCKED] anchor CLI no está instalada."
  echo "Instala Anchor CLI: https://www.anchor-lang.com/docs/installation"
  exit 1
fi

PROGRAM_ID=$(grep -E '^declare_id!' programs/ranti_checkin/src/lib.rs | sed -E 's/.*"([^"]+)".*/\1/')

echo "Usando Program ID: ${PROGRAM_ID}"
solana config set --url devnet
anchor build
anchor deploy --provider.cluster devnet

echo "Deploy finalizado."
echo "Actualiza NEXT_PUBLIC_PROGRAM_ID=${PROGRAM_ID} en .env.local"
