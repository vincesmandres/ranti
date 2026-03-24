# ranti

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_puA8ItpRP6N8YxJcSxS9h9sVLNTN)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Solana Devnet check-in setup

Create a `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Solana network consistency (frontend + backend)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr

# Runtime/feature flags
NEXT_PUBLIC_APP_ENV=dev
RANTI_APP_ENV=dev
NEXT_PUBLIC_RANTI_ENABLE_ONCHAIN_CHECKIN=true
RANTI_ENABLE_ONCHAIN_CHECKIN=true
```

When on-chain check-in is enabled, the app requires wallet signature and will fail explicitly if:
- wallet is not linked to the authenticated profile,
- attestation persistence fails, or
- tx signature cannot be verified on the configured Solana cluster.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/vincesmandres/ranti" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
