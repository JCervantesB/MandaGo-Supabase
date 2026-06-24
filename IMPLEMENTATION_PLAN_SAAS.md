# MandaGO SaaS - Plan de Implementación Progresiva

## Visión General

MandaGO es una plataforma SaaS de dispatch para gestión de entregas de última milla.

### Tech Stack
- **Frontend**: React + Vite (`apps/web-admin`)
- **Backend**: Supabase (Auth, Postgres, Storage, Realtime)
- **Mobile**: Expo React Native (`apps/mobile`)
- **Validación**: Zod
- **Mapas**: MapLibre + Geoapify

### Modelo SaaS
- MandaGO gestiona la plataforma y drivers centralizados
- Empresas (tenants) contratan el servicio
- Cada empresa tiene: admins, operadores, pickup points, recipients, órdenes

---

## Modelo de Datos

### Entidades Principales

| Tabla | Descripción |
|-------|-------------|
| `companies` | Empresas que usan MandaGO (tenants) |
| `internal_users` | Usuarios de empresa (admin, operator) |
| `drivers` | Repartidores (pertenecen a MandaGO) |
| `pickup_points` | Puntos de recolección |
| `recipients` | Destinatarios finales |
| `recipient_addresses` | Direcciones de recipients |
| `delivery_orders` | Órdenes de entrega |

### Roles

| Rol | Pertenece a | Descripción |
|-----|-------------|-------------|
| `mandago_admin` | MandaGO | Gestiona todo |
| `admin` | Empresa | Gestiona su empresa |
| `operator` | Empresa | Crea órdenes, ve reportes |
| `driver` | MandaGO | Ejecuta entregas (mobile) |

---

## Fases de Implementación

### Fase 1: Auth (THIS PHASE)
**Objetivo**: Sistema de login/registro funcional

#### Archivos a crear:
```
apps/web-admin/src/
├── pages/
│   ├── login.tsx              # Login con email/password
│   └── register.tsx           # Registro de empresa + admin
├── hooks/
│   └── useAuth.tsx            # Auth context y provider
├── lib/
│   └── supabase/
│       ├── client.ts           # Cliente Supabase
│       └── types.ts            # Tipos de DB
└── components/
    └── ProtectedRoute.tsx      # Ruta protegida
```

#### Rutas:
- `/login` - Login
- `/register` - Registro empresa

#### Flujo:
1. Register crea `auth.users` + `companies` + `internal_users` (admin)
2. Login valida credenciales
3. Redirección según rol

#### Migraciones SQL:
- Tabla `companies`
- Tabla `internal_users`
- Función `get_user_company_id()`
- RLS policies

---

### Fase 2: Layout + Dashboard
**Objetivo**: Layout base con sidebar y dashboard vacío

#### Archivos a crear:
```
apps/web-admin/src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   └── Layout.tsx             # Layout con sidebar
├── pages/
│   └── dashboard.tsx          # Dashboard vacío
└── App.tsx                     # Routing con Layout
```

#### Rutas:
- `/dashboard` - Dashboard (protegido)

#### Componentes UI necesarios:
- Button (primary, secondary, danger, ghost)
- Input (text, email, password)
- Card
- Badge
- Alert

---

### Fase 3: Perfil de Empresa
**Objetivo**: Admin puede ver/editar su empresa

#### Archivos a crear:
```
apps/web-admin/src/
├── pages/
│   └── settings/
│       └── company.tsx         # Editar empresa
├── hooks/
│   └── useCompany.tsx          # Company context
└── repositories/
    └── company.ts              # Repository pattern
```

#### Rutas:
- `/settings/company` - Editar empresa (protegido, admin/operator)

---

### Fase 4: Gestión de Usuarios
**Objetivo**: Admin puede gestionar operadores de su empresa

#### Archivos a crear:
```
apps/web-admin/src/
├── pages/
│   └── users/
│       ├── index.tsx           # Lista de usuarios
│       └── [id].tsx            # Editar usuario
├── hooks/
│   └── useUsers.tsx
└── repositories/
    └── user.ts
```

#### Rutas:
- `/users` - Lista de usuarios
- `/users/[id]` - Editar usuario

#### Migraciones SQL:
- RPC functions para CRUD usuarios

---

### Fase 5: Pickup Points
**Objetivo**: CRUD de puntos de recolección

#### Archivos a crear:
```
apps/web-admin/src/
├── pages/
│   └── pickup-points/
│       ├── index.tsx
│       └── [id].tsx
├── hooks/
│   └── usePickupPoints.tsx
└── repositories/
    └── pickup-point.ts
```

#### Rutas:
- `/pickup-points` - Lista
- `/pickup-points/[id]` - Crear/editar

---

### Fase 6: Recipients (Destinatarios)
**Objetivo**: CRUD de destinatarios con direcciones

#### Archivos a crear:
```
apps/web-admin/src/
├── pages/
│   └── recipients/
│       ├── index.tsx
│       └── [id].tsx
├── hooks/
│   └── useRecipients.tsx
└── repositories/
    └── recipient.ts
```

#### Rutas:
- `/recipients` - Lista
- `/recipients/[id]` - Crear/editar

---

### Fase 7: Delivery Orders
**Objetivo**: Crear y gestionar órdenes de entrega

#### Archivos a crear:
```
apps/web-admin/src/
├── pages/
│   └── orders/
│       ├── index.tsx           # Lista de órdenes
│       ├── new.tsx             # Nueva orden
│       └── [id].tsx            # Detalle de orden
├── hooks/
│   └── useOrders.tsx
└── repositories/
    └── order.ts
```

#### Rutas:
- `/orders` - Lista
- `/orders/new` - Nueva orden
- `/orders/[id]` - Detalle

---

### Fase 8: Drivers (MandaGO Admin)
**Objetivo**: Gestión de drivers centralizados

#### Archivos a crear:
```
apps/web-admin/src/
├── pages/
│   └── drivers/
│       ├── index.tsx
│       └── [id].tsx
└── repositories/
    └── driver.ts
```

#### Rutas:
- `/drivers` - Lista (solo mandago_admin)
- `/drivers/[id]` - Detalle

---

### Fase 9: Mobile App (Drivers)
**Objetivo**: App móvil para drivers

#### Estructura:
```
apps/mobile/src/
├── screens/
│   ├── login.tsx
│   ├── orders.tsx
│   └── order-detail.tsx
├── hooks/
│   └── useDriverAuth.tsx
└── components/
```

---

## Convenciones

### Archivos y Rutas
- Todo en inglés
- URLs en inglés: `/users`, `/pickup-points`, `/orders`
- Nombres de archivos en inglés: `useAuth.tsx`, `users.tsx`

### Código
- Feature-based folder structure dentro de pages
- Repository pattern para acceso a datos
- Context + Hooks para estado global
- Zod para validación
- TypeScript strict

### Estilos
- Tailwind CSS
- Componentes UI base reutilizables
- Design tokens (colors, spacing)

---

## Orden de Implementación

```
1. Auth (login, register)
   ↓
2. Layout + Dashboard
   ↓
3. Perfil de Empresa
   ↓
4. Gestión de Usuarios
   ↓
5. Pickup Points
   ↓
6. Recipients
   ↓
7. Delivery Orders
   ↓
8. Driver Management
   ↓
9. Mobile App (Drivers)
```

---

## Notas

- Cada fase es independiente y deployable
- Migraciones SQL en `supabase/migrations/`
- Schemas Zod en `packages/shared/src/schemas/`
- RPC functions para operaciones complejas
- RLS para seguridad a nivel de fila
