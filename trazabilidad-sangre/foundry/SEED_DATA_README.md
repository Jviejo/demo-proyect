# Script de Generación de Datos de Prueba

Este script genera datos de prueba para el sistema de trazabilidad de sangre, creando múltiples donantes ficticios con 2-3 donaciones cada uno.

## Requisitos Previos

1. **Centro de Donación Registrado y Aprobado**: Debes tener una wallet registrada como Centro de Donación y aprobada por los administradores.

2. **Contratos Desplegados**: Los contratos deben estar desplegados en la red objetivo (Anvil local o Trias Testnet).

3. **Configuración de Red**: Archivo `.anvil-env` configurado con las URLs de RPC.

## Configuración

### 1. Actualizar Dirección del Contrato

Edita `script/SeedData.s.sol` y actualiza la constante `BLOOD_TRACKER_ADDRESS` con la dirección de tu contrato desplegado:

```solidity
address constant BLOOD_TRACKER_ADDRESS = 0xTU_DIRECCION_AQUI;
```

### 2. Configurar Parámetros

En el archivo `SeedData.s.sol` puedes ajustar:

```solidity
uint256 constant NUM_DONORS = 50;              // Número de donantes
uint256 constant MIN_DONATIONS_PER_DONOR = 2;  // Mínimo de donaciones por donante
uint256 constant MAX_DONATIONS_PER_DONOR = 3;  // Máximo de donaciones por donante
```

## Ejecución

### En Anvil (Red Local)

```bash
cd foundry
make seed-data-anvil
```

### En Trias Testnet

```bash
cd foundry
make seed-data-tsc
```

## ¿Qué hace el script?

1. **Genera 50 donantes ficticios** con direcciones Ethereum únicas
2. **Crea 2-3 donaciones por donante** (alternando entre 2 y 3)
3. **Distribuye las donaciones** a lo largo del tiempo
4. **Registra todas las donaciones** usando el Centro de Donación configurado

## Resultados Esperados

- **Total de donaciones**: ~125 donaciones (50 donantes × 2.5 promedio)
- **Donantes creados**: 50 direcciones únicas
- **Datos visibles en**:
  - Dashboard de Centro de Donación: Historial de todas las donaciones
  - Dashboard de Donantes: Cada donante verá sus 2-3 donaciones
  - Página de Trazabilidad: Todas las donaciones serán rastreables

## Solución de Problemas

### Error: "Only donation centers can donate"

Asegúrate de que la wallet que está ejecutando el script esté:
1. Registrada como Centro de Donación (Role = 1)
2. Aprobada por los administradores

### Error: "Insufficient payment"

Verifica que el script esté enviando el `minimumDonationFee` correcto. El script lo obtiene automáticamente del contrato.

### Error: "Revert"

Revisa los logs con `-vvvv` para ver el error específico:

```bash
forge script script/SeedData.s.sol:SeedData --rpc-url $ANVIL_RPC_URL --private-key 0x... --broadcast -vvvv
```

## Personalización

### Cambiar el número de donantes

```bash
# Edita SeedData.s.sol y cambia:
uint256 constant NUM_DONORS = 100;  // Para 100 donantes
```

### Usar un Centro de Donación específico

Puedes usar la función alternativa `generateDonationsWithCenter`:

```solidity
// En el script, llama a:
seedData.generateDonationsWithCenter(YOUR_PRIVATE_KEY);
```

## Verificación

Después de ejecutar el script:

1. **Centro de Donación**: Verifica que veas ~125 donaciones en el dashboard
2. **Donantes**: Conecta con una de las wallets de donantes y verifica que veas 2-3 donaciones
3. **Trazabilidad**: Busca cualquier tokenID y verifica el historial completo

## Notas Importantes

- ⚠️ **No ejecutar en producción**: Este script es solo para testing
- 💰 **Costo de gas**: Cada donación requiere gas, multiplica por ~125 transacciones
- 🔑 **Private Keys**: Las private keys de los donantes son derivadas determinísticamente (no usar en producción)
- 📊 **Performance**: Generar 125 donaciones puede tomar varios minutos en testnets
