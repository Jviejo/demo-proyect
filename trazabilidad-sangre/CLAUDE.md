# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Descripción del Proyecto

Sistema de trazabilidad de sangre y derivados sanguíneos basado en blockchain. El proyecto combina smart contracts en Solidity (Foundry) con un frontend Next.js para registrar donaciones, procesar derivados y rastrear toda la cadena de suministro de productos sanguíneos.

## Arquitectura del Sistema

### Smart Contracts (Foundry - Solidity 0.8.20)

El sistema consta de 3 contratos principales interconectados:

- **BloodTracker** (Contrato principal): Gestiona el registro de roles (centros de donación, laboratorios, traders), procesa donaciones y coordina el marketplace. Utiliza un sistema de roles (DONATION_CENTER, LABORATORY, TRADER) y emite eventos `Donation` para rastrear el proceso.

- **BloodDonation** (ERC721): NFT que representa una unidad de sangre completa donada. Se quema (burn) cuando se procesa en derivados. Mantiene referencias a los derivados generados mediante la estructura `Donation{plasmaId, erythrocytesId, plateletsId}`.

- **BloodDerivative** (ERC721): NFT que representa derivados procesados de la sangre (Plasma, Eritrocitos, Plaquetas). Incluye trazabilidad completa con timestamps y referencias a la donación original.

- **Marketplace**: Funcionalidad heredada por BloodTracker para permitir el intercambio de derivados entre entidades registradas.

### Frontend (Next.js 14 + TypeScript)

- Framework: Next.js 14.2.4 con App Router
- Integración Web3: Web3.js 4.10.0 + MetaMask
- UI: React Bootstrap, TailwindCSS, styled-components
- Autenticación: SIWE (Sign-In With Ethereum)

Estructura clave:
- `src/lib/contracts/`: ABIs y configuración de contratos (BloodTracker, BloodDonation, BloodDerivative)
- `src/lib/types.ts`: Tipos TypeScript para eventos y datos blockchain
- `src/lib/events.ts`: Utilidades para parsear eventos de contratos
- `src/app/`: Páginas Next.js organizadas por funcionalidad (marketplace, extraction, role-registro, etc.)

## Comandos de Desarrollo

### Smart Contracts (Foundry)

Ejecutar desde el directorio raíz del proyecto:

```bash
# Build de contratos
forge build

# Tests
forge test

# Tests con verbosidad
forge test -vvv

# Test específico
forge test --match-test <nombre_funcion>

# Formatear código Solidity
forge fmt
```

### Deployment de Contratos

**Para red local Anvil:**
```bash
# 1. Iniciar Anvil (accesible desde cualquier IP)
anvil --host 0.0.0.0

# 2. Desplegar contratos (desde directorio raíz)
cd foundry && make deploy-anvil
```

**Para Trias Testnet (TSC):**
```bash
cd foundry && make deploy-tsc
```

Nota: Los deployment scripts están en `foundry/script/DeployBlood.s.sol`. Las direcciones de los contratos desplegados se guardan en `foundry/broadcast/`.

### Frontend (Next.js)

```bash
# Desarrollo (puerto 3000)
npm run dev

# Producción (puerto 3003)
npm run build
npm run start

# Linting
npm run lint
```

## Configuración Importante

### Variables de Entorno

Crear archivo `.anvil-env` en `foundry/` con:
```
ANVIL_RPC_URL=http://localhost:8545
TRIAS_RPC_URL=<url_de_trias_testnet>
```

### Direcciones de Contratos Desplegados (TSC)

Referencia en README.md:
- BloodTracker: 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
- BloodDonation: 0x0165878A594ca255338adfa4d48449f69242Eb8F
- BloodDerivative: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853

### Foundry Configuration

El archivo `foundry.toml` configura paths personalizados:
- src: `./foundry/src`
- test: `./foundry/test`
- script: `./foundry/script`
- out: `./foundry/out`

## Flujo de Trabajo del Sistema

1. **Registro**: Las entidades se registran en BloodTracker con su rol (DONATION_CENTER, LABORATORY, TRADER)
2. **Donación**: Un centro de donación crea un NFT de BloodDonation pagando una fee mínima (0.001 ETH)
3. **Procesamiento**: Los laboratorios queman el NFT de BloodDonation y generan 3 NFTs de BloodDerivative (Plasma, Eritrocitos, Plaquetas)
4. **Marketplace**: Los traders pueden intercambiar derivados entre entidades registradas
5. **Trazabilidad**: Todos los eventos se registran en blockchain y pueden consultarse mediante eventos `Donation` y `Transfer`

## Testing

Los tests están en `foundry/test/BloodTest.t.sol` y cubren:
- Registro de roles
- Proceso de donación
- Generación de derivados
- Validaciones de permisos y roles

## Notas de Desarrollo

- El sistema usa el patrón de herencia para compartir funcionalidad entre contratos
- Los eventos de blockchain se parsean en el frontend usando tipos TypeScript estrictos
- La trazabilidad se construye leyendo eventos históricos de la blockchain
- El frontend requiere MetaMask para interactuar con los contratos
- Este es un sistema Windows, probablemente corriendo en Git Bash
- Usar `gh` CLI para operaciones de GitHub
