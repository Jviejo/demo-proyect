# Instrucciones: Batería Completa de Datos de Prueba

Este documento describe cómo usar el sistema de seed data completo para poblar el sistema de trazabilidad de sangre con datos de prueba.

## 📋 Resumen

El sistema incluye:
- **10 wallets** con diferentes roles (3 centros, 2 labs, 2 traders, 2 hospitales, 1 manufacturer)
- **150 donaciones** distribuidas entre los centros
- **60 derivados** procesados (20 bolsas × 3 derivados)
- **Transacciones de marketplace** simuladas
- **Trazabilidad completa** funcionando

## 🚀 Pasos de Ejecución

### Paso 1: Verificar Dependencias

Asegúrate de que `ethers.js` esté instalado:

```bash
npm list ethers
```

Si no está instalado, el proyecto ya lo incluye como dependencia de desarrollo.

### Paso 2: Generar Wallets

**IMPORTANTE:** Las wallets ya están generadas y configuradas en el script. Si necesitas regenerarlas:

```bash
cd foundry
node scripts/generateWallets.js
```

Esto creará el archivo `foundry/.clientWallets` con 10 wallets determinísticas.

⚠️ **Nota de Seguridad:**
- El archivo `.clientWallets` contiene claves privadas
- Ya está excluido del repositorio git (`.gitignore`)
- Solo para testing/desarrollo
- NUNCA usar en producción

### Paso 3: Compilar Contratos

```bash
forge build
```

### Paso 4: Ejecutar Seed Data

#### Opción A: Besu CodeCrypto (Producción)

Asegúrate de tener configuradas las variables de entorno en `foundry/.anvil-env`:

```bash
BESU_RPC_URL=https://besu1.proyectos.codecrypto.academy
BESU_PRIVATE_KEY=0x3f5d84191f172800677da32d4897e048404cfeb23c2c360edaa4341464d43b1c
```

Ejecutar:

```bash
cd foundry
forge script script/SeedDataComplete.s.sol:SeedDataComplete \
  --rpc-url $BESU_RPC_URL \
  --private-key $BESU_PRIVATE_KEY \
  --broadcast \
  -vvvv
```

⏱️ **Duración estimada:** 5-10 minutos

#### Opción B: Anvil Local (Testing)

1. Iniciar Anvil en una terminal:

```bash
anvil --host 0.0.0.0
```

2. En otra terminal, ejecutar el seed:

```bash
cd foundry
forge script script/SeedDataComplete.s.sol:SeedDataComplete \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast \
  -vvvv
```

## 📊 Distribución de Datos

### Wallets por Rol

| Rol | Cantidad | Nombres |
|-----|----------|---------|
| DONATION_CENTER | 3 | Centro Donación Madrid, Barcelona, Valencia |
| LABORATORY | 2 | Laboratorio Central, Laboratorio Regional Norte |
| TRADER | 2 | Trader Alpha Bio, Trader Beta Med |
| HOSPITAL | 2 | Hospital General, Hospital Clínico |
| MANUFACTURER | 1 | Cosmetics Plasma Corp |

### Datos Generados

- **Funding:** 1000 ETH transferido a cada wallet desde admin
- **Donaciones:** 150 bolsas (50 por cada centro)
- **Derivados:** 60 (20 bolsas procesadas × 3 derivados cada una)
- **Marketplace:**
  - Laboratorios listan derivados
  - Traders compran y revenden
  - Hospitales compran bolsas
- **Trazabilidad:**
  - Hospital administra producto a paciente
  - Manufacturer crea lote de producto cosmético

## ✅ Verificación de Resultados

### 1. Verificar Balances

```bash
# Ejemplo: verificar balance del primer centro
cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --rpc-url $BESU_RPC_URL
```

Debería mostrar ~1000 ETH (menos fees gastados).

### 2. Verificar Roles Registrados

```bash
# Ejemplo: verificar centro de donación
cast call 0xAD02838C74214EE9FD253b678c489a7885527f1C \
  "companies(address)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  --rpc-url $BESU_RPC_URL
```

### 3. Verificar Total de Donaciones

```bash
cast call 0x02f2Ad3c32374c98DD52747a8cf825907CbDe794 \
  "totalSupply()" \
  --rpc-url $BESU_RPC_URL
```

Debería retornar: **130** (150 - 20 procesadas)

### 4. Verificar Total de Derivados

```bash
cast call 0x8Cdd7b2Fa65D5c5EbadCf660821d4150559c42bb \
  "totalSupply()" \
  --rpc-url $BESU_RPC_URL
```

Debería retornar: **60** (20 bolsas × 3 derivados)

### 5. Verificar en Frontend

```bash
# Iniciar frontend
npm run dev
```

Abrir http://localhost:3000 y verificar:
- ✅ Donaciones listadas
- ✅ Marketplace con productos
- ✅ Trazabilidad completa funcionando

## 🔧 Troubleshooting

### Error: "Admin no tiene suficiente ETH"

El admin necesita al menos 10,000 ETH para transferir 1000 ETH a cada una de las 10 wallets.

Verificar balance:
```bash
cast balance 0x60015448D7418C4e70275a5aA2340086A9f8Dd01 --rpc-url $BESU_RPC_URL
```

### Error: "Request ID not found"

Puede ocurrir si el registro falla. Verificar que:
1. El admin tiene rol `ADMIN_ROLE` o `SUPER_ADMIN_ROLE`
2. La conexión a la red es estable

### Error: Compilación falla

Asegúrate de que el optimizador está habilitado en `foundry.toml`:

```toml
optimizer = true
optimizer_runs = 1000
```

## 📁 Archivos del Sistema

### Scripts

- `foundry/scripts/generateWallets.js` - Genera wallets determinísticas
- `foundry/script/SeedDataComplete.s.sol` - Script principal de seed data

### Configuración

- `foundry/.clientWallets` - Wallets generadas (NO versionado en git)
- `foundry/.anvil-env` - Variables de entorno para redes
- `foundry/Makefile` - Comandos make para facilitar ejecución

### Contratos Desplegados (Besu CodeCrypto)

- **BloodTracker:** `0xAD02838C74214EE9FD253b678c489a7885527f1C`
- **BloodDonation:** `0x02f2Ad3c32374c98DD52747a8cf825907CbDe794`
- **BloodDerivative:** `0x8Cdd7b2Fa65D5c5EbadCf660821d4150559c42bb`

## 🔐 Seguridad

**IMPORTANTE:**
- Las wallets generadas son determinísticas desde un mnemonic de testing
- **NUNCA** usar estas wallets con fondos reales
- El mnemonic usado es público: `"test test test test test test test test test test test junk"`
- Solo para desarrollo/testing
- Las claves privadas están en el archivo `.clientWallets` que está excluido de git

## 📚 Recursos Adicionales

- **Plan original:** Ver archivo de plan en el historial del chat
- **CLAUDE.md:** Documentación del proyecto
- **README.md:** Documentación general del sistema

## 🆘 Soporte

Si encuentras problemas:
1. Revisar los logs con `-vvvv`
2. Verificar conexión a la red
3. Verificar que todos los contratos estén desplegados
4. Consultar la documentación del proyecto

---

**Última actualización:** 2026-01-16
