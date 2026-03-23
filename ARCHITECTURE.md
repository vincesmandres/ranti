# Ranti - Full-Stack Next.js Architecture

## Estructura del Proyecto

```
app/
├── layout.tsx                 # Root layout con WalletProvider
├── page.tsx                   # Landing page con modales
├── middleware.ts              # Session management
├── dashboard/
│   └── page.tsx              # Dashboard protegido (ProtectedRoute)
├── organizer/
│   └── page.tsx              # Organizador dashboard
├── api/
│   └── auth/
│       ├── wallet/
│       │   └── login/route.ts       # POST: Genera mensaje para firmar
│       ├── verify-wallet/route.ts   # POST: Verifica firma y crea sesión
│       └── logout/route.ts          # POST: Cierra sesión
├── tickets/
│   ├── page.tsx                     # Lista de tickets del usuario
│   └── [id]/page.tsx                # Detalle de ticket
├── check-in/
│   └── success/page.tsx             # Confirmación de check-in
├── rewards/
│   └── page.tsx                     # Panel de recompensas
├── history/
│   └── page.tsx                     # Historial de actividad
├── login/
│   └── page.tsx                     # Pantalla de login
├── wallet-connect/
│   └── page.tsx                     # Conexión de wallet
├── verify-phone/
│   └── page.tsx                     # Verificación OTP
├── eventos/
│   └── page.tsx                     # Lista de eventos
├── inventory/
│   └── page.tsx                     # Inventario de tickets
└── marketplace/
    └── page.tsx                     # Marketplace de tickets

lib/
├── supabase/
│   ├── client.ts              # Supabase client-side
│   ├── server.ts              # Supabase server-side
│   └── middleware.ts          # Session refresh middleware
├── solana/
│   ├── auth.ts                # Lógica de autenticación Solana
│   ├── wallet-provider.tsx    # WalletProvider component
│   └── use-wallet.ts          # Hook para wallet state
├── hooks/
│   └── use-auth.ts            # Hook para auth state
├── types.ts                   # TypeScript types
├── config.ts                  # Configuración global
├── api.ts                     # API client utilities
└── mock-data.ts               # Mock data para desarrollo

components/
├── protected-route.tsx        # Wrapper para rutas protegidas
├── layouts/
│   └── auth-layout.tsx        # Layout para usuarios autenticados
├── ui/
│   ├── status-pill.tsx
│   ├── verification-badge.tsx
│   ├── step-indicator.tsx
│   ├── activity-timeline.tsx
│   ├── action-cta.tsx
│   └── ticket-card.tsx
└── dashboard-header.tsx       # Header del dashboard

scripts/
├── 001_create_profiles.sql    # Crear tablas con RLS
└── 002_profile_trigger.sql    # Trigger para auto-crear perfiles

middleware.ts                  # Root middleware para sesiones
```

## Base de Datos (Supabase)

### Tablas Creadas:
1. **profiles** - Datos del usuario
   - id (UUID, PK, FK auth.users)
   - wallet_address
   - username
   - avatar_url
   - created_at, updated_at
   - RLS: Usuario solo ve su propio perfil

2. **tickets** - Entradas del usuario
   - id, user_id, event_id
   - ticket_number, status (active, used, transferred)
   - created_at, expires_at
   - RLS: Usuario solo ve sus tickets

3. **events** - Eventos disponibles
   - id, organizer_id
   - title, description, date
   - ticket_price, max_tickets
   - RLS: Público para lectura

4. **check_ins** - Verificaciones on-chain
   - id, user_id, event_id, ticket_id
   - verified_at, transaction_hash
   - RLS: Usuario solo ve sus check-ins

5. **rewards** - Recompensas y puntos
   - id, user_id
   - points, level, tier
   - RLS: Usuario solo ve sus recompensas

6. **activity_log** - Historial de actividad
   - id, user_id
   - action, metadata, created_at
   - RLS: Usuario solo ve su actividad

## Flujo de Autenticación

### 1. Login con Wallet
```
Usuario → Selecciona "Organizador" o "Asistente" 
       → Modal Login con "Connect Wallet"
       → Wallet Adapter abre popup
       → Usuario aprueba en Phantom/Solflare
```

### 2. Verificación
```
Wallet Conectada → POST /api/auth/wallet/login
                → Server genera mensaje a firmar
                → Usuario firma en wallet
                → POST /api/auth/verify-wallet
                → Server verifica firma
                → Crea sesión Supabase
                → Crea perfil en profiles table
```

### 3. Dashboard Protegido
```
Usuario Autenticado → ProtectedRoute wrapper
                    → useAuth() verifica sesión
                    → Renderiza dashboard
                    → Usuario puede ver tickets, rewards, etc.
```

## UI Estados

### Wallet Connection States:
1. **disconnected** - Botón "Connect Wallet"
2. **connecting** - Animación de carga
3. **connected** - Wallet conectada, pedir firma
4. **awaiting signature** - Esperando firma del usuario
5. **authenticated** - Usuario logueado, mostrar dashboard
6. **error** - Mostrar mensaje de error

## Integración con Solana

### Wallets Soportados:
- Phantom
- Solflare

### Network:
- Default: `devnet`
- Configurable via `NEXT_PUBLIC_SOLANA_NETWORK`

### Endpoint:
- Usa `clusterApiUrl()` de `@solana/web3.js`

## Variables de Entorno

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Dev Redirect
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=
```

## Hooks Disponibles

### useAuth()
```typescript
const { user, loading, error, logout } = useAuth()

// User shape:
{
  id: string
  email?: string
  wallet_address?: string
  user_metadata?: any
}
```

### useWallet()
```typescript
const { publicKey, wallet, connecting, connected, signMessage, connect, disconnect } = useWallet()
```

## API Endpoints

### POST /api/auth/wallet/login
Genera mensaje para firmar
```json
{
  "publicKey": "..."
}
```

Respuesta:
```json
{
  "message": "Sign this message...",
  "success": true
}
```

### POST /api/auth/verify-wallet
Verifica firma y crea sesión
```json
{
  "publicKey": "...",
  "signature": "...",
  "message": "..."
}
```

Respuesta:
```json
{
  "success": true,
  "user": { "id": "...", "wallet_address": "..." },
  "session": { ... }
}
```

### POST /api/auth/logout
Cierra sesión
```json
{
  "success": true
}
```

## Componentes UI Principales

### ProtectedRoute
Wrapper que requiere autenticación
```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### AuthLayout
Layout para usuarios autenticados con header y navegación
```tsx
<AuthLayout>
  <MainContent />
</AuthLayout>
```

## Características

✅ Full-stack Next.js 15 con App Router
✅ Supabase Web3 Auth
✅ Solana Wallet integration (Phantom, Solflare)
✅ Row Level Security (RLS) en todas las tablas
✅ Auto-crear perfiles con trigger
✅ Session management con middleware
✅ Rutas protegidas con ProtectedRoute
✅ TypeScript completo
✅ Diseño visual original preservado
✅ Responsive UI
✅ API endpoints siguiendo REST standards

## Próximos Pasos

1. Configurar variables de entorno de Supabase
2. Conectar dominio personalizado
3. Implementar payment gateway (Stripe)
4. Agregar verificación de teléfono real (Twilio)
5. Implementar on-chain transactions
6. Setup de Sentry para monitoring
