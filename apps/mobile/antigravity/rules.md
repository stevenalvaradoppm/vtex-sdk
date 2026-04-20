---
trigger: always_on
---

# Reglas del Proyecto — App Club Promerica

Este documento define la arquitectura, convenciones, patrones y estilos del proyecto. Cualquier AI o desarrollador que trabaje aquí debe seguir estas reglas para mantener consistencia.

---

## 1. Stack Tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | React Native 0.79.x |
| Lenguaje | TypeScript 5.x (strict) |
| Estilos | NativeWind (Tailwind CSS para RN) |
| Variantes de componentes | Tailwind Variants (`tv`) |
| Inyección de dependencias | Inversify (`@injectable`, `@inject`) |
| Estado servidor | TanStack React Query v5 |
| Estado local | Redux Toolkit (mínimo, solo para estado global de UI) |
| Internacionalización | i18next + react-i18next |
| HTTP Client | Axios (instancias configuradas) |
| Testing | Jest + React Native Testing Library |
| Fonts | NunitoSans (Regular, Bold) |
| Scaling | react-native-size-matters (`moderateScale`) |


---

## 2. Arquitectura por Capas

El proyecto sigue **Clean Architecture** con 3 capas estrictas:

```
src/
├── data/          # Capa de datos (infraestructura)
├── domain/        # Capa de dominio (reglas de negocio)
└── presentation/  # Capa de presentación (UI)
```

### Reglas de dependencia

- `domain` **NO** depende de `data` ni `presentation`. Es la capa más interna.
- `data` implementa los contratos definidos en `domain`. Puede importar de `domain`.
- `presentation` consume `domain` a través de hooks y el contenedor de IoC. Nunca importa directamente de `data`.
- Evitar atajos entre capas. Si una screen necesita algo de negocio, debe venir por hook, interactor o contrato claro.

---

## 3. Capa Domain (`src/domain/`)

```
domain/
├── constants/       # Constantes de negocio (StorageKeys, Analytics)
├── entity/          # Entidades y tipos del dominio
│   ├── Banner/
│   │   └── Banner.ts
│   ├── Types/       # Símbolos para IoC
│   │   ├── RepositoryTypes.ts
│   │   ├── UseCaseTypes.ts
│   │   ├── ServiceTypes.ts
│   │   └── StorageTypes.ts
│   └── ...
├── interactors/     # Casos de uso (Use Cases)
│   ├── Banner/
│   │   └── GetBannersUseCase.ts
│   └── ...
├── repository/      # Interfaces de repositorio
│   ├── Banner/
│   │   └── IBannerRepository.ts
│   └── ...
└── services/        # Servicios de dominio
    ├── CountryService.ts
    ├── UserService.ts
    └── ...
```

### 3.1 Entidades

- Se definen como `type` (no `interface`) en `domain/entity/{Nombre}/{Nombre}.ts`.
- Representan el modelo de negocio, **no** el modelo de la API.
- Propiedades en `camelCase`, tipos claros, sin `any`.

```typescript
// domain/entity/Banner/Banner.ts
export type Banner = {
  image: string
  title: string
  description: string
  callToAction: string
  weight: number
  position: string
  titleButton?: string
}
```

### 3.2 Interfaces de Repositorio

- Se definen como `interface` con prefijo `I` en `domain/repository/{Nombre}/I{Nombre}Repository.ts`.
- Métodos retornan `Promise<T>`.

```typescript
// domain/repository/Banner/IBannerRepository.ts
import type {Banner} from '@/domain/entity/Banner/Banner'

export default interface IBannerRepository {
  getBanners(position: string): Promise<Banner[]>
}
```

### 3.3 Interactors (Use Cases)

- Clases `@injectable()` en `domain/interactors/{Nombre}/{NombreVerbo}UseCase.ts`.
- Inyectan repositorios vía `@inject(RepositoryTypes.X)`.
- Exponen un único método `execute(...)` con tipos explícitos.
- Nombres descriptivos: `Get{Recurso}UseCase`, `Save{Recurso}UseCase`, `Activate{Recurso}UseCase`.

```typescript
// domain/interactors/Banner/GetBannersUseCase.ts
import 'reflect-metadata'
import {injectable, inject} from 'inversify'
import type {Banner} from '@/domain/entity/Banner/Banner'
import {type Positions} from '@/domain/entity/CMS/positions'
import RepositoryTypes from '@/domain/entity/Types/RepositoryTypes'
import type IBannerRepository from '@/domain/repository/Banner/IBannerRepository'

@injectable()
export default class GetBannersUseCase {
  private readonly bannerRepository: IBannerRepository

  constructor(
    @inject(RepositoryTypes.BannerRepository)
    bannerRepository: IBannerRepository,
  ) {
    this.bannerRepository = bannerRepository
  }

  async execute(position: Positions): Promise<Banner[]> {
    return this.bannerRepository.getBanners(position)
  }
}
```

### 3.4 Tipos para IoC (Symbols)

Cada tipo de binding tiene su archivo de símbolos en `domain/entity/Types/`:

- `RepositoryTypes.ts` — Símbolos para repositorios
- `UseCaseTypes.ts` — Símbolos para use cases
- `ServiceTypes.ts` — Símbolos para servicios de dominio
- `StorageTypes.ts` — Símbolos para storage

Patrón:

```typescript
const RepositoryTypes = Object.freeze({
  BannerRepository: Symbol.for('BannerRepository'),
  // ...agregar aquí nuevos repositorios
})

export default RepositoryTypes
```

### 3.5 Services (Domain)

- Clases `@injectable()` que encapsulan lógica reutilizable entre use cases.
- Inyectan use cases y proveen métodos de negocio.

```typescript
@injectable()
export default class CountryService {
  constructor(
    @inject(UseCaseTypes.GetTenantIdUseCase)
    private readonly getTenantIdUseCase: GetTenantIdUseCase,
  ) {}

  async getTenantId(): Promise<string> {
    const tenantId = await this.getTenantIdUseCase.execute()
    if (!tenantId) {
      throw new Error('Tenant ID is not available.')
    }
    return tenantId
  }
}
```

---

## 4. Capa Data (`src/data/`)

```
data/
├── Repository/      # Implementaciones de repositorios
│   ├── Banner/
│   │   └── BannerRepository.ts
│   └── ...
├── adapters/        # Transformaciones y filtros de datos crudos
│   ├── Banner/
│   │   └── bannerAdapter.ts
│   └── ...
├── dtos/            # Data Transfer Objects (forma de la API)
│   ├── banner/
│   │   └── banner.dto.ts
│   └── ...
├── mappers/         # DTO → Entity del dominio
│   ├── banner/
│   │   ├── banner.mapper.ts
│   │   └── mock.banner.ts
│   └── ...
├── errorMappers/    # Mapeo de errores HTTP → errores de dominio
│   ├── ErrorCode.ts
│   ├── ErrorMapper.ts
│   └── Auth/
├── provider/        # Clientes HTTP configurados
│   ├── Axios/
│   │   ├── axiosClient.ts
│   │   ├── axiosGeneric.ts
│   │   └── axiosPublicClient.ts
│   └── Algolia/
├── __mocks__/       # Mocks para testing
└── constants/       # Constantes de data
```

### 4.1 DTOs

- Se definen como `interface` en `data/dtos/{nombre}/{nombre}.dto.ts`.
- Reflejan exactamente la forma de la respuesta de la API.
- Nombre: `{Nombre}DTO` (sufijo DTO en PascalCase).

```typescript
// data/dtos/banner/banner.dto.ts
export interface BannerDTO {
  mobileUrl: string
  title: string
  description: string
  callToAction: string
  weight: number
  position: string
  titleButton?: string
}
```

### 4.2 Mappers

- Funciones puras en `data/mappers/{nombre}/{nombre}.mapper.ts`.
- Convierten de DTO a entidad de dominio.
- Nombre: `map{Nombre}DtoToDomain` (singular) y `map{Nombre}sDtoToDomain` (plural).

```typescript
// data/mappers/banner/banner.mapper.ts
export const mapBannerDtoToDomain = (dto: BannerDTO): Banner => {
  return {
    image: dto.mobileUrl.replace(/^http:/, 'https:'),
    title: dto.title,
    // ...mapear campos
  }
}

export const mapBannersDtoToDomain = (dtos: BannerDTO[]): Banner[] => {
  return dtos.map(mapBannerDtoToDomain)
}
```

### 4.3 Adapters

- Funciones puras en `data/adapters/{Nombre}/{nombre}Adapter.ts`.
- Realizan filtrado, ordenamiento, limitación de datos crudos **antes** del mapeo.
- Manejan `null`, `undefined` y arrays vacíos explícitamente.

```typescript
// data/adapters/Banner/bannerAdapter.ts
const MAX_BANNERS = 5

export const getBannersAdapter = (data: BannerDTO[]): BannerDTO[] => {
  if (!data) return []
  const dataFiltered = filterBanners(data)
  const bannersSliced = sliceBanners(dataFiltered, MAX_BANNERS)
  return sortBanners(bannersSliced)
}
```

### 4.4 Repositories (Implementación)

- Clases `@injectable()` que implementan la interface del dominio.
- Ubicación: `data/Repository/{Nombre}/{Nombre}Repository.ts`.
- Usan el cliente Axios, adapters y mappers.
- Endpoints vienen de `presentation/constants/api`.

```typescript
@injectable()
export default class BannerRepository implements IBannerRepository {
  constructor(
    @inject(ServiceTypes.CountryService)
    private readonly countryService: CountryService,
  ) {}

  async getBanners(position: string): Promise<Banner[]> {
    const countryCode = await this.countryService.getTenantId()
    const {data} = await axios.get(
      API_ENDPOINTS.BANNERS.GET_BANNERS_BY_COUNTRY_AND_POSITION(
        countryCode,
        position,
      ),
    )
    const banners = getBannersAdapter(data)
    return mapBannersDtoToDomain(banners)
  }
}
```

### 4.5 Error Handling

- `ApiError` extiende `Error` con `code` (ErrorCode enum) y `rid`.
- `ErrorMapper` centraliza el mapeo de errores HTTP a `ApiError`.
- `ErrorCode` es un enum con códigos de letra: `SESSION = 'A'`, `INTERNAL = 'B'`, etc.

### 4.6 Provider Axios

- Instancias preconfiguradas en `data/provider/Axios/`.
- `axiosClient.ts` — Cliente autenticado con Bearer token.
- `axiosPublicClient.ts` — Cliente sin autenticación.
- `axiosGeneric.ts` — Factory para crear instancias.
- Interceptores centralizados.

---

## 5. Capa Presentation (`src/presentation/`)

```
presentation/
├── Views/            # Pantallas organizadas por stack
│   ├── AppStack/
│   │   ├── Tabs/
│   │   │   ├── HomeScreen/
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   ├── components/
│   │   │   │   └── hooks/
│   │   │   ├── RewardsStack/
│   │   │   ├── TravelScreen/
│   │   │   ├── WalletScreen/
│   │   │   └── MyAccountStack/
│   │   ├── RewardDetailStack/
│   │   └── ExploreMoreScreen/
│   ├── AuthStack/
│   ├── OnboardingStack/
│   └── LoadingScreen/
├── components/
│   ├── Common/       # Componentes reutilizables base
│   ├── Feedback/     # Alert, Badge, BadgeDot, Dialog, InlineLoader, Snackbar, Tooltip
│   ├── Form/         # Componentes de formulario
│   ├── Layout/       # Layouts
│   ├── Providers/    # Context providers
│   ├── shared/       # Componentes compartidos entre features
│   ├── TabBar/       # Tab bar personalizado
│   ├── Splash/       # Splash screen
│   └── ViewDeck/     # Card deck views
├── hooks/
│   ├── queries/      # Hooks de React Query (useGet*, useSave*, useActivate*)
│   ├── analytics/    # Hooks de analytics
│   ├── useAuth/      # Autenticación
│   ├── usePullToRefreshQueries/
│   ├── useRefreshQueries/
│   └── ...           # Hooks de UI y utilidad
├── navigation/       # Navegación
│   ├── AppStack/
│   ├── AuthStack/
│   ├── onboardingStack/
│   ├── linking/      # Deep linking
│   ├── RootNavigator.tsx
│   └── types.ts      # Tipos de rutas
├── config/
│   ├── inversify/    # Contenedor IoC y módulos
│   ├── i18n/         # Internacionalización
│   ├── store/        # Redux store
│   ├── queryClient.tsx
│   └── enviroment.ts # Variables de entorno
├── constants/
│   ├── api/          # API_ENDPOINTS
│   ├── queries/      # Query keys (QK_*, MK_*)
│   ├── routes/       # Rutas de navegación (ROUTES)
│   ├── storage/      # Keys de storage
│   └── ...
├── theme/            # Paleta de colores, spacing, scaling
├── helpers/          # Funciones helper puras
├── utils/            # Utilidades
├── redux/            # Slices de Redux
├── services/         # Servicios de presentación (Pushwoosh)
└── types/            # Tipos compartidos de presentación
```

### 5.1 Screens (Views)

- Ubicación: `Views/{Stack}/{NombreScreen}/{NombreScreen}.tsx`.
- Cada screen puede tener subcarpetas `components/` y `hooks/` propios.
- Las screens **no** contienen lógica de negocio compleja; la delegan a hooks.
- Usan `usePullToRefreshQueries` para pull-to-refresh con las query keys reales.
- Exportan como `export default function NombreScreen()`.

```typescript
export default function HomeScreen() {
  const {data, isLoading, isError} = useGetUser(true)
  const {isRefreshing, handleRefresh} = usePullToRefreshQueries({
    queries: [
      {queryKey: QK_USER},
      {queryKey: QK_CATEGORIES},
      {queryKey: QK_BANNERS},
    ],
  })

  return (
    <View className="flex-1 bg-layout-background">
      {/* contenido */}
    </View>
  )
}
```

---

## 6. Inyección de Dependencias (Inversify)

### 6.1 Contenedor

- Archivo principal: `presentation/config/inversify/container.ts`.
- Re-export: `presentation/config/inversify.config.ts`.
- Registra módulos por feature.

```typescript
// presentation/config/inversify/container.ts
import {Container} from 'inversify'
import {registerBannerModule} from './modules/banner.module'
// ...

const container = new Container()
registerBannerModule(container)
// ...
export default container
```

### 6.2 Módulos

- Un archivo por feature en `presentation/config/inversify/modules/{nombre}.module.ts`.
- Función `register{Nombre}Module(container: Container): void`.
- Registra: Repository → Interface, UseCase → UseCase.

```typescript
// modules/banner.module.ts
export function registerBannerModule(container: Container): void {
  container
    .bind<IBannerRepository>(RepositoryTypes.BannerRepository)
    .to(BannerRepository)

  container
    .bind<GetBannersUseCase>(UseCaseTypes.GetBannersUseCase)
    .to(GetBannersUseCase)
}
```

### 6.3 Agregar un nuevo feature (checklist)

1. Crear entidad en `domain/entity/{Nombre}/{Nombre}.ts`
2. Crear interface en `domain/repository/{Nombre}/I{Nombre}Repository.ts`
3. Crear use case en `domain/interactors/{Nombre}/{Verbo}{Nombre}UseCase.ts`
4. Agregar Symbol en `domain/entity/Types/RepositoryTypes.ts` y `UseCaseTypes.ts`
5. Crear DTO en `data/dtos/{nombre}/{nombre}.dto.ts`
6. Crear mapper en `data/mappers/{nombre}/{nombre}.mapper.ts`
7. Crear adapter en `data/adapters/{Nombre}/{nombre}Adapter.ts` (si aplica)
8. Crear repositorio en `data/Repository/{Nombre}/{Nombre}Repository.ts`
9. Crear módulo en `presentation/config/inversify/modules/{nombre}.module.ts`
10. Registrar módulo en `container.ts`
11. Crear query key en `presentation/constants/queries/index.ts`
12. Crear hook en `presentation/hooks/queries/useGet{Nombre}/useGet{Nombre}.ts`
13. Crear endpoint en `presentation/constants/api/index.ts`
14. Crear tests en `__tests__/`

---

## 7. Componentes con Tailwind Variants (`tv`)

### 7.1 Estructura de archivos

Cada componente con variantes sigue esta estructura:

```
ComponentName/
├── ComponentName.tsx    # Componente React
├── variants.ts          # Definición de variantes con tv()
├── types.ts             # Tipos del componente
└── index.ts             # Re-export
```

### 7.2 Definición de variantes

Usar `tv()` de `tailwind-variants`. Dos patrones:

**Patrón simple (sin slots):**

```typescript
// variants.ts
import {tv} from 'tailwind-variants'

export const textStyles = tv({
  base: 'text-darkGray-90',
  variants: {
    variant: {
      body: '',
      label: '',
      title: '',
    },
    size: {xs: '', s: '', m: '', l: ''},
    weight: {
      regular: 'font-nunito',
      bold: 'font-nunito-bold',
    },
  },
  compoundVariants: [
    {variant: 'body', size: 'xs', class: 'text-sm leading-[21px]'},
    // ...
  ],
  defaultVariants: {
    variant: 'body',
    size: 'xs',
    weight: 'regular',
  },
})
```

**Patrón con slots:**

```typescript
// variants.ts
import {tv} from 'tailwind-variants'

export const switchStyles = tv({
  slots: {
    container: 'w-[42px] h-6',
    track: 'w-full h-full rounded-xl justify-center px-0.5',
    thumb: 'w-5 h-5 rounded-full bg-white',
  },
  variants: {
    checked: {
      true: {track: 'bg-secondary-60'},
      false: {track: 'bg-lightGray-30'},
    },
    variant: {
      normal: {},
      hover: {},
      pressed: {},
      disabled: {container: 'opacity-100'},
    },
  },
  compoundVariants: [
    {
      checked: true,
      variant: 'hover',
      class: {track: 'bg-secondary-70'},
    },
    // ...
  ],
  defaultVariants: {
    variant: 'normal',
    checked: false,
  },
})
```

### 7.3 Tipos del componente

```typescript
// types.ts
import type {switchStyles} from './variants'
import type {VariantProps} from 'tailwind-variants'

export interface SwitchProps extends VariantProps<typeof switchStyles> {
  value: boolean
  onValueChange?: (value: boolean) => void
  disabled?: boolean
}
```

- Usar `VariantProps<typeof styles>` para heredar las props de variante.
- Agregar `className?: string` cuando el componente acepte clases externas.

### 7.4 Componente

```typescript
// ComponentName.tsx
import {clsx} from 'clsx'
import React from 'react'
import {textStyles} from './variants'
import {type TextComponentsProps} from './types'

const Text = ({variant, weight, size, children, className, ...rest}) => {
  return (
    <RNText
      {...rest}
      className={clsx(textStyles({variant, size, weight}), className)}>
      {children}
    </RNText>
  )
}

export default Text
```

### 7.5 Componentes compuestos (Compound Components)

Para componentes complejos, usar `Object.assign`:

```typescript
const CommonCard = Object.assign(Card, {
  Media,
  Header,
  Body,
  Title,
  Footer,
  Skeleton,
})

export default CommonCard
```

Uso: `<Card><Card.Media /><Card.Body /></Card>`

---

## 8. Paleta de Colores

Los colores se definen en `src/presentation/theme/colors.json` y se integran automáticamente en Tailwind via `tailwind.config.js`.

### 8.1 Fuente de verdad

Los colores se definen **únicamente** en `src/presentation/theme/colors.json`. Este archivo es la **single source of truth**. Nunca hardcodear valores hex en componentes, variantes ni en este documento. Si necesitas un color, consulta `colors.json`.

La estructura es un objeto donde cada categoría agrupa sus tonos por escala numérica:

```json
{
  "categoria": {
    "escala": "#HEX"
  }
}
```

### 8.2 Categorías de colores

| Categoría | Escala | Uso |
|---|---|---|
| `primary` | 10, 20, 30, 40, 60, 70, 80, 100 | Color principal de marca (verde oscuro) |
| `secondary` | 10, 20, 30, 40, 60, 70, 80, 100 | Color secundario (verde claro/lima) |
| `tertiary` | 50-900 | Color terciario (azul) |
| `success` | 50-900 | Estados de éxito |
| `warning` | 50-900 | Estados de advertencia |
| `danger` | 50-900 | Estados de error |
| `info` | 50-900 | Estados informativos |
| `darkGray` | 50, 60, 70, 80, 90, 100 | Textos y fondos oscuros |
| `lightGray` | 10, 20, 30, 40, 100 | Bordes, fondos claros, separadores |
| `layout` | background, foreground, fondo10, fondo20 | Fondos de pantalla |
| `foreground` | foreground, primary, secondary, ... | Color de texto sobre colores de fondo |
| `semanticAudience` | azulMarino, azulReal, gris, grisReal | Colores semánticos de audiencia |
| `semanticProduct` | morado, rosa, naranja, turquesa | Colores semánticos de producto |

### 8.3 Uso en NativeWind

```tsx
// Fondos
<View className="bg-primary-70" />
<View className="bg-layout-background" />
<View className="bg-secondary-60" />

// Textos
<Text className="text-darkGray-90" />
<Text className="text-danger-500" />

// Bordes
<View className="border-lightGray-30" />
```

### 8.4 Cómo agregar un nuevo color

1. Agregar en `src/presentation/theme/colors.json` siguiendo la estructura existente.
2. Si la nueva categoría necesita safelist dinámico, agregar patrón en `tailwind.config.js` → `safelist`.
3. El color estará disponible automáticamente como clase de Tailwind.

### 8.5 Safelist en Tailwind

Para clases dinámicas que se construyen en runtime, agregar en safelist de `tailwind.config.js`:

```javascript
safelist: [
  {
    pattern:
      /(bg|text|border)-(primary|secondary|tertiary|success|warning|danger|info)-(10|20|30|40|50|60|80|100)/,
  },
  {
    pattern:
      /(bg|text|border)-(success|warning|danger|info)-(50|100|200|300|400|500|600|700|800|900)/,
  },
  {
    pattern:
      /(bg|text|border)-(darkGray|lightGray)-(10|20|30|40|60|70|80|90|100)/,
  },
]
```

### 8.6 Acceso programático a colores

Cuando se necesite un color fuera de className (por ejemplo para `tintColor` o `shadowColor`), importar desde el theme:

```typescript
import {colors} from '@/presentation/theme'

// Acceder por categoría y escala
colors.darkGray['90']
colors.primary['70']
colors.foreground.primary
```

Nunca escribir hex directamente. Siempre referenciar `colors.{categoria}['{escala}']`.

---

## 9. Tipografía y Spacing

### 9.1 Font Families

| Clase Tailwind | Font |
|---|---|
| `font-nunito` | NunitoSans-Regular |
| `font-nunito-bold` | NunitoSans-Bold |

Archivos de fuente en `assets/fonts/`.

### 9.2 Font Sizes (responsive con moderateScale)

Los tamaños de fuente usan CSS variables calculadas con `moderateScale` de `react-native-size-matters`:

```typescript
// src/presentation/theme/scalingPoints.ts
const scalingPoints = {
  '--fs-tiny': moderateScale(11) + 'px',   // text-tiny
  '--fs-xs': moderateScale(13) + 'px',     // text-xs
  '--fs-sm': moderateScale(14) + 'px',     // text-sm
  '--fs-base': moderateScale(16) + 'px',   // text-base
  '--fs-lg': moderateScale(18) + 'px',     // text-lg
  '--fs-xl': moderateScale(22) + 'px',     // text-xl
  '--fs-2xl': moderateScale(24) + 'px',    // text-2xl
  '--fs-3xl': moderateScale(26) + 'px',    // text-3xl
  '--fs-4xl': moderateScale(30) + 'px',    // text-4xl
  '--fs-5xl': moderateScale(32) + 'px',    // text-5xl
}
```

Uso: `<Text className="text-lg font-nunito-bold" />`

### 9.3 Spacing Tokens

Definidos en `src/presentation/theme/spacing.json`. Base: `1 unidad = 4px`.

| Token | Valor | Token | Valor |
|---|---|---|---|
| `0.25` | 1px | `8` | 32px |
| `0.5` | 2px | `10` | 40px |
| `1` | 4px | `12` | 48px |
| `2` | 8px | `16` | 64px |
| `3` | 12px | `20` | 80px |
| `4` | 16px | `24` | 96px |
| `6` | 24px | `58` | 232px |

Uso: `<View className="px-4 py-2 mt-6 mb-3" />`

### 9.4 Shadows

```javascript
boxShadow: {
  xs: '0 0 12px rgba(30, 30, 30, 0.12)',
}
```

Uso: `shadow-xs`

---

## 10. Hooks de Queries (React Query)

### 10.1 Patrón de hook de query

```typescript
// presentation/hooks/queries/useGet{Nombre}/useGet{Nombre}.ts
import {useQuery} from '@tanstack/react-query'
import UseCaseTypes from '@/domain/entity/Types/UseCaseTypes'
import type GetBannersUseCase from '@/domain/interactors/Banner/GetBannersUseCase'
import container from '@/presentation/config/inversify.config'
import {QK_BANNERS} from '@/presentation/constants/queries'

const uc = container.get<GetBannersUseCase>(UseCaseTypes.GetBannersUseCase)

function useGetBanners(position: Positions, enabled = true) {
  const queryKey = [...QK_BANNERS, position ?? null] as const

  return useQuery({
    queryKey,
    queryFn: async () => uc.execute(position),
    enabled: enabled,
  })
}

export default useGetBanners
```

**Reglas:**
- El use case se obtiene fuera del hook con `container.get()`.
- Query key se compone de la constante `QK_*` + parámetros.
- El hook retorna directamente el resultado de `useQuery`.

### 10.2 Query Keys

Definidas en `presentation/constants/queries/index.ts`:

```typescript
export const QK_USER = ['user'] as const
export const QK_CATEGORIES = ['categories'] as const
export const QK_BANNERS = ['banners'] as const
// Mutations usan prefijo MK_
export const MK_ACTIVATE_REWARD = ['activate_reward'] as const
```

**Convención:**
- Queries: `QK_{NOMBRE}` (prefijo `QK_`)
- Mutations: `MK_{NOMBRE}` (prefijo `MK_`)
- Valor: array readonly con string descriptivo en snake_case.

### 10.3 Pull to Refresh

```typescript
const {isRefreshing, handleRefresh} = usePullToRefreshQueries({
  queries: [
    {queryKey: QK_USER},
    {queryKey: QK_CATEGORIES},
    {queryKey: QK_BANNERS},
  ],
})
```

Usar `usePullToRefreshQueries` con las query keys reales que la pantalla consume.

### 10.4 Query Client Config

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

---

## 11. Navegación

### 11.1 Estructura de stacks

```
RootNavigator
├── Auth (AuthStack)
│   ├── WelcomeAuth
│   ├── WelcomeBack
│   ├── Login
│   └── GenerateAccess
├── App (AppStack)
│   ├── Tabs
│   │   ├── Home
│   │   ├── Benefits (RewardsStack)
│   │   ├── Travel
│   │   ├── More / Wallet
│   │   └── MyAccount (MyAccountStack)
│   ├── RewardDetailStack
│   ├── ExploreMore
│   └── NotificationCenter
└── Onboarding (OnboardingStack)
```

### 11.2 Tipos de rutas

Cada stack tiene su tipo en `presentation/navigation/types.ts`:

```typescript
export type AuthRoutes = {
  WelcomeAuth: undefined
  Login: {pendingDeepLink?: string}
}

export type AppStackRoutes = {
  Tabs: NavigatorScreenParams<AppTabRoutes>
  RewardDetailStack: NavigatorScreenParams<RewardDetailRoutes>
}

export type RootRoutes = {
  Auth: NavigatorScreenParams<AuthRoutes>
  App: NavigatorScreenParams<AppStackRoutes>
  Onboarding: NavigatorScreenParams<OnboardingRoutes>
}
```

### 11.3 Constantes de rutas

Las rutas se definen como constantes en `presentation/constants/routes/`:

```typescript
export const ROUTES = {
  stackAuth,
  stackOnboarding,
  stackApp,
} as const
```

Uso en navegación:

```typescript
navigation.navigate(ROUTES.stackApp.name, {
  screen: ROUTES.stackApp.tabs.name,
  params: {
    screen: ROUTES.stackApp.tabs.myAccountStack.name,
  },
})
```

---

## 12. Internacionalización (i18n)

### 12.1 Estructura

```
presentation/config/i18n/
├── index.ts          # Configuración de i18next
├── constants.ts      # NAMESPACE_INTL
├── types.ts          # Tipado fuerte de traducciones
└── resources/
    └── es/           # Traducciones en español
        ├── home.json
        ├── auth.json
        ├── benefit.json
        ├── profile.json
        └── ...
```

### 12.2 Agregar un nuevo namespace

1. Crear archivo JSON en `resources/es/{nombre}.json`.
2. Importar en `i18n/index.ts` y agregar a `resources.es`.
3. Agregar namespace al array `ns` en la config de `i18n.init()`.
4. Agregar tipo en `i18n/types.ts`:
   - Importar el JSON como type.
   - Agregar al type `Namespace`.
   - Agregar a interface `Resources`.
   - Agregar a `CustomTypeOptions.defaultNS`.
5. Agregar constante en `i18n/constants.ts` → `NAMESPACE_INTL`.

### 12.3 Uso

```typescript
import {useTranslation} from 'react-i18next'

const {t} = useTranslation('home')
// o
const {t} = useTranslation('benefit')

<Text>{t('sectionTitle')}</Text>
```

---

## 13. Constantes

### 13.1 API Endpoints

```typescript
// presentation/constants/api/index.ts
export const API_ENDPOINTS = {
  AUTH: {
    AUTHORIZE: '/api/v1/identity/prom/authorize',
    LOGIN: '/api/v1/identity/prom/login',
  },
  BANNERS: {
    GET_BANNERS_BY_COUNTRY_AND_POSITION: (
      countryCode: string,
      position: string,
    ) => `/api/v1/cms/${countryCode}/banners/?position=${position}`,
  },
  // ...
} as const
```

### 13.2 Storage Keys

```typescript
// domain/constants/StorageKeys.ts
export const StorageKeys = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  COUNTRY_CODE_KEY: '@clubpromerica:countryCode',
  // ...
} as const
```

### 13.3 Variables de entorno

Se acceden a través de `presentation/config/enviroment.ts`:

```typescript
import {CONFIG_ENV} from '@/presentation/config/enviroment'
// CONFIG_ENV.API_BASE_URL, CONFIG_ENV.AMPLITUDE_API_KEY, etc.
```

Archivos `.env.preprod` y `.env.prod` en la raíz. Usar `react-native-config`.

---

## 14. Testing

### 14.1 Estructura

```
__tests__/
├── data/
│   ├── Repository/     # Tests de repositorios
│   ├── adapters/       # Tests de adapters
│   ├── mappers/        # Tests de mappers
│   └── errorMappers/   # Tests de error mappers
├── domain/
│   ├── interactors/    # Tests de use cases
│   └── constants/      # Tests de constantes
└── presentation/
    ├── helpers/        # Tests de helpers
    └── components/     # Tests de componentes
```

### 14.2 Convenciones

- Archivo: `{Nombre}.test.ts` o `{Nombre}.test.tsx`.
- La estructura de carpetas en `__tests__/` replica la de `src/`.
- Usar `jest.fn()` para mocks de dependencias.
- Usar `as any` solo cuando sea imprescindible para mocks.
- Tests pequeños, enfocados, un `describe` por clase/función.

### 14.3 Test de Use Case

```typescript
describe('GetBannersUseCase', () => {
  it('returns banners from repository', async () => {
    const repo = {
      getBanners: jest.fn().mockResolvedValue([{id: '1'}]),
    } as any
    const useCase = new GetBannersUseCase(repo)

    const result = await useCase.execute('home' as any)

    expect(repo.getBanners).toHaveBeenCalledWith('home')
    expect(result).toEqual([{id: '1'}])
  })
})
```

### 14.4 Test de Mapper

```typescript
describe('banner.mapper', () => {
  it('maps DTO to domain entity', () => {
    const dto: BannerDTO = {
      mobileUrl: 'http://example.com/img.jpg',
      title: 'Test',
      // ...
    }
    const result = mapBannerDtoToDomain(dto)

    expect(result.image).toBe('https://example.com/img.jpg')
    expect(result.title).toBe('Test')
  })
})
```

### 14.5 Cobertura

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  },
}
```

El umbral de cobertura es **100%** para todo el código dentro del scope de coverage.

### 14.6 Comandos

```bash
npm run test              # Ejecutar tests
npm run test:coverage     # Tests con cobertura
npm run check:all         # Format + Lint + Typecheck + Tests
```

---

## 15. Formateo y Linting

### 15.1 Prettier (`.prettierrc.js`)

```javascript
module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
}
```

**Reglas clave:**
- Single quotes (`'`) — NO double quotes
- Sin bracket spacing — `{data}` no `{ data }`
- Trailing commas en todo
- Arrow parens: avoid — `x => x` no `(x) => x`
- Brackets same line en JSX

### 15.2 ESLint (`.eslintrc.js`)

**Reglas activas:**
- `unused-imports/no-unused-imports`: **error** — No imports sin usar.
- `@typescript-eslint/consistent-type-imports`: **error** — Usar `type` imports: `import type {X} from '...'` o `import {type X} from '...'` (inline style).
- `import/order`: **error** — Imports ordenados alfabéticamente, sin newlines entre grupos, `@/**` como internal.
- `no-restricted-syntax`: **error** — Prohibido usar tipos inline en parámetros de funciones. Crear `type` o `interface` aparte.
- `import/no-duplicates`: **error** — No imports duplicados del mismo módulo.

**Orden de imports:**
1. builtin
2. external
3. internal (`@/...`)
4. parent
5. sibling
6. index
7. type

### 15.3 TypeScript (`tsconfig.json`)

```json
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    "types": ["reflect-metadata"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

- Path alias: `@/` apunta a `src/`.
- Decorators habilitados para Inversify.

---

## 16. Naming Conventions

### 16.1 Archivos y carpetas

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componente React | PascalCase | `Text.tsx`, `BannerCard.tsx` |
| Hook | camelCase con `use` prefix | `useGetBanners.tsx` |
| Variantes | camelCase | `variants.ts` |
| Tipos | camelCase | `types.ts` |
| Entity (domain) | PascalCase | `Banner.ts` |
| DTO | camelCase con `.dto` suffix | `banner.dto.ts` |
| Mapper | camelCase con `.mapper` suffix | `banner.mapper.ts` |
| Adapter | camelCase con `Adapter` suffix | `bannerAdapter.ts` |
| Repository impl | PascalCase | `BannerRepository.ts` |
| Repository interface | `I` prefix + PascalCase | `IBannerRepository.ts` |
| Use Case | PascalCase + `UseCase` suffix | `GetBannersUseCase.ts` |
| Test | `.test.ts` / `.test.tsx` suffix | `GetBannersUseCase.test.ts` |
| Constants | camelCase archivo, UPPER_SNAKE values | `queries/index.ts` → `QK_BANNERS` |
| Module IoC | kebab-case con `.module` suffix | `banner.module.ts` |
| i18n resource | camelCase | `home.json`, `benefit.json` |
| Carpeta de feature | PascalCase | `Banner/`, `Rewards/` |
| Carpeta en data | PascalCase o camelCase según contexto | `Repository/`, `mappers/` |

### 16.2 Código

| Elemento | Convención | Ejemplo |
|---|---|---|
| Variables | camelCase | `const dataUser = ...` |
| Funciones | camelCase con verbo | `getBanners()`, `handlePress()` |
| Event handlers | `handle` prefix | `handleRefresh`, `handleAvatarPress` |
| Componentes | PascalCase | `const BannersHome = ...` |
| Tipos | PascalCase | `type Banner = {...}` |
| Interfaces | PascalCase, `I` prefix para repos | `IBannerRepository` |
| Constantes | UPPER_SNAKE_CASE | `QK_BANNERS`, `MAX_BANNERS` |
| Enums | PascalCase | `ErrorCode`, `PlatformEnum` |
| Symbols IoC | PascalCase (string) | `Symbol.for('BannerRepository')` |
| Props type | PascalCase + `Props` suffix | `SwitchProps`, `AlertProps` |
| Query keys | `QK_` o `MK_` prefix | `QK_USER`, `MK_ACTIVATE_REWARD` |

---

## 17. Providers (Context)

```
components/Providers/
├── FlagActivateProvider/    # Feature flags (Amplitude)
├── FontSizeProvider/        # Tamaño de fuente dinámico
├── InitializerProvider/     # Inicialización de la app
├── NavigationProvider/      # Navigation container
├── PushwooshPermissionGate/ # Gate de permisos push
├── QueryProvider/           # TanStack QueryClientProvider
├── ReduxProvider/           # Redux Provider
├── SessionProvider/         # Estado de sesión
└── index.ts
```

Cada provider sigue el patrón estándar de React Context con su carpeta propia.

---

## 18. Barrel Exports (index.ts)

- Cada carpeta de componentes (`Common/`, `Feedback/`, `shared/`, `hooks/`) tiene un `index.ts` que re-exporta.
- Usar `export {default as X} from './X'` o `export * from './X'`.
- Esto permite imports limpios: `import {Text, Card, Icon} from '@/presentation/components/Common'`.

---

## 19. Estilos — Reglas generales

- **Siempre** usar `className` con clases de NativeWind. Evitar `StyleSheet` salvo casos de animación o estilos dinámicos complejos.
- Usar `clsx()` para combinar clases condicionales.
- Colores siempre desde la paleta: nunca hardcodear hex directamente en className. Si se necesita un color programático, usar `colors` del theme.
- Componente `Text` custom como base para todo texto (maneja font scaling, font family, variantes).
- Skeletons: usar `SkeletonSwap` con prop `isLoading` + `skeleton` para transiciones loading → content.
- Accessibility: usar `accessibilityRole`, `accessibilityLiveRegion`, `hitSlop` en elementos interactivos.

---

## 20. Resumen de comandos

```bash
# Desarrollo
npm run start                # Metro bundler
npm run start:preprod        # Metro con env preprod
npm run ios                  # Run iOS
npm run android              # Run Android

# Calidad
npm run lint                 # ESLint
npm run lint:fix             # ESLint autofix
npm run format               # Prettier
npm run typecheck            # TypeScript check
npm run test                 # Jest
npm run test:coverage        # Jest con cobertura
npm run check:all            # Todo junto
```
