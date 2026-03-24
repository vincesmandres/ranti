# Ranti — Solana Devnet (Anchor check-in/attestation)

Proyecto Next.js + Supabase + Solana Wallet Adapter con flujo de check-in/attestation on-chain usando programa Anchor en Devnet.

## Estado actual del flujo on-chain

1. Cliente crea attestation pendiente en DB (`/api/attestations/prepare`).
2. Cliente envía `check_in` al programa Anchor (tx #1).
3. Cliente envía `commit_attestation` al programa Anchor (tx #2, contiene firma de check-in).
4. Backend valida transacciones en RPC, valida ownership de PDAs y persiste `tx_signature` real (`/api/attestations/commit`).
5. Backend cierra check-in de ticket (`/api/tickets/[id]/check-in`) solo si attestation committed coincide.

No hay hash fake ni fallback silencioso cuando está habilitado on-chain.

## Estructura Anchor

- `Anchor.toml`
- `Cargo.toml` (workspace)
- `programs/ranti_checkin/src/lib.rs`
- `tests/ranti-checkin.ts`
- `migrations/deploy.ts`

### Instrucciones del programa
- `initialize_config` (opcional)
- `check_in`
- `commit_attestation`

### PDAs
- `checkin_record`: seeds `["checkin", user, ticket_ref_32]`
- `attestation_record`: seeds `["attestation", user, ticket_ref_32]`

## Variables de entorno

Crear `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Solana Devnet
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Program ID (debe coincidir con deploy real)
NEXT_PUBLIC_PROGRAM_ID=6L9fJY4qf2nB4V9YwVh3E2wQ5s7Y3K1mN8pR2tU4xZcQ

# Entorno/feature flags
NEXT_PUBLIC_APP_ENV=dev
RANTI_APP_ENV=dev
NEXT_PUBLIC_RANTI_ENABLE_ONCHAIN_CHECKIN=true
RANTI_ENABLE_ONCHAIN_CHECKIN=true
```

## Comandos

### Next.js
```bash
npm run dev
npm run typecheck
npm run lint
```

### Anchor (requiere Anchor CLI + Solana CLI instalados)
```bash
npm run anchor:build
npm run anchor:test
npm run anchor:deploy
./scripts/deploy-devnet.sh
```

También:
```bash
anchor keys list
anchor build
anchor deploy --provider.cluster devnet
```

## Deploy Devnet y actualización de Program ID

1. `solana config set --url devnet`
2. `anchor keys list` (obtén `ranti_checkin` program keypair)
3. `anchor deploy --provider.cluster devnet`
4. Actualiza `declare_id!` en `programs/ranti_checkin/src/lib.rs` y `Anchor.toml` con el Program ID final.
5. Actualiza `NEXT_PUBLIC_PROGRAM_ID` con ese Program ID.

## Rent / fees (referencia práctica)

- Cada PDA inicializada consume rent-exemption (depende de bytes de cuenta).
- Cuentas actuales:
  - `CheckInRecord`: `8 + INIT_SPACE` (pubkey + refs + timestamp + bump)
  - `AttestationRecord`: `8 + INIT_SPACE` (pubkey + refs + firma + timestamp + flags)
- Fee por tx: estándar de devnet según congestión + compute.

Para ver renta exacta en runtime:
```bash
solana rent <ACCOUNT_DATA_BYTES>
```

## Verificación E2E manual (Devnet)

1. Conecta wallet y autentica sesión.
2. Abre un ticket en `/tickets/[id]` y ejecuta check-in.
3. Firma tx de `check_in` y luego tx de `commit_attestation`.
4. Verifica `txSignature` en `/check-in/success`.
5. Abre Solscan devnet desde la UI.
6. Confirma en DB que `attestations.tx_signature` quedó persistida y estado `committed_devnet`.

## Bloqueos explícitos

Si falta algo de infraestructura externa:
- Sin `profiles.wallet_address` enlazada -> API responde `412`.
- Sin tabla/policies de `attestations` -> API responde `503` en prepare.
- Si tx no existe/no coincide con programa/ownership -> API responde `409`.

## Marketplace

Flujo marketplace se mantiene sin cambios funcionales; integración nueva está acotada a check-in/attestation.
