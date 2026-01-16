# Actualización del Frontend - Nuevas Direcciones de Contratos

## Cambios Realizados

Se han actualizado las direcciones de los contratos desplegados en Anvil para que el frontend apunte a la nueva instancia de los contratos.

### 1. Variables de Entorno (`.env.local`)

**Archivo:** `.env.local`

Se actualizaron las siguientes variables:

```bash
# Antes
NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS=0x0165878A594ca255338adfa4d48449f69242Eb8F
NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS=0x5FC8d32690cc91D4c39d9d3abcBD16989F875707

# Ahora
NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS=0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS=0x0165878A594ca255338adfa4d48449f69242Eb8F
```

#### Cambios Específicos:
- ✓ **BloodTracker**: Actualizado de `0x0165...Eb8F` → `0xa513...C853`
- ✓ **BloodDonation**: Sin cambios (ya era correcta)
- ✓ **BloodDerivative**: Actualizado de `0x5FC8...5707` → `0x0165...Eb8F`

### 2. ABIs de Contratos

Se actualizaron los ABIs de los tres contratos con las versiones compiladas más recientes:

**Archivos actualizados:**
- `src/lib/contracts/BloodTracker.ts`
- `src/lib/contracts/BloodDonation.ts`
- `src/lib/contracts/BloodDerivative.ts`

Los ABIs ahora reflejan la estructura exacta de los contratos desplegados, incluyendo:
- Sistema de aprobación de solicitudes
- Roles y permisos actualizados
- Marketplace funcional
- Nuevos eventos y funciones

### 3. Detalles de los Contratos Desplegados

#### BloodTracker (Contrato Principal)
```
Dirección: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
Bloque: #12
Gas Usado: 6,435,551
```

#### BloodDonation (ERC721 - Sangre Completa)
```
Dirección: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
Bloque: #9
Gas Usado: 2,407,902
Owner: BloodTracker
```

#### BloodDerivative (ERC721 - Derivados)
```
Dirección: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Bloque: #11
Gas Usado: 2,401,485
Owner: BloodTracker
```

## Cómo Usar el Frontend Actualizado

### 1. Asegúrate de que Anvil esté corriendo

```bash
anvil --host 0.0.0.0 --disable-code-size-limit
```

**Nota:** El flag `--disable-code-size-limit` es necesario porque BloodTracker (28.7KB) excede el límite EIP-170 (24.5KB).

### 2. Reinicia el servidor de desarrollo

Si el servidor de Next.js ya estaba corriendo, debes reiniciarlo para que tome las nuevas variables de entorno:

```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar:
npm run dev
```

### 3. Conecta MetaMask a Anvil Local

**Configuración de red:**
- **Network Name:** Anvil Local
- **RPC URL:** http://localhost:8545
- **Chain ID:** 31337
- **Currency Symbol:** ETH

**Cuenta de prueba (Admin):**
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Balance: 10,000 ETH
```

### 4. Verificación de Configuración

Para verificar que las direcciones están correctas, puedes usar la consola del navegador:

```javascript
// En la consola del navegador (F12)
console.log('BloodTracker:', process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS);
console.log('BloodDonation:', process.env.NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS);
console.log('BloodDerivative:', process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS);
```

O verificar desde la blockchain directamente:

```bash
# Verificar BloodTracker
cast code 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853 --rpc-url http://localhost:8545

# Verificar ownership de BloodDonation
cast call 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 "owner()" --rpc-url http://localhost:8545
# Debe retornar: 0x000000000000000000000000a513e6e4b8f2a923d98304ec87f64353c4d5c853
```

## Funcionalidades Disponibles

Con estos contratos desplegados, el frontend tiene acceso completo a:

✅ **Sistema de Registro y Aprobación**
- Solicitud de registro para Centros de Donación, Laboratorios, Hospitales, Manufacturers
- Panel de administración para aprobar/rechazar solicitudes
- Gestión de roles

✅ **Donación de Sangre**
- Registro de donaciones
- Mint de NFTs de BloodDonation
- Trazabilidad completa

✅ **Procesamiento de Derivados**
- Burn de sangre completa
- Generación de 3 derivados (Plasma, Eritrocitos, Plaquetas)
- Mint de NFTs de BloodDerivative

✅ **Marketplace**
- Listado de derivados para venta
- Compra de derivados
- Actualización de precios
- Cancelación de listings

## Troubleshooting

### Error: "Cannot read properties of undefined (reading 'call')"
- **Causa:** Anvil no está corriendo o las direcciones de contratos son incorrectas
- **Solución:** Verifica que Anvil esté corriendo y que las direcciones en `.env.local` sean correctas

### Error: "Contract not deployed at address"
- **Causa:** Los contratos no están desplegados en esa dirección en Anvil
- **Solución:** Redesplegar los contratos o cargar un snapshot de Anvil con estado guardado

### Las transacciones fallan con "execution reverted"
- **Causa:** Posiblemente la cuenta no tiene los permisos necesarios
- **Solución:** Asegúrate de que la cuenta esté registrada y aprobada para el rol correspondiente

## Archivos Modificados

- ✓ `.env.local` - Variables de entorno actualizadas
- ✓ `src/lib/contracts/BloodTracker.ts` - ABI actualizado
- ✓ `src/lib/contracts/BloodDonation.ts` - ABI actualizado
- ✓ `src/lib/contracts/BloodDerivative.ts` - ABI actualizado

## Próximos Pasos

1. **Probar el flujo completo:**
   - Registro de entidades
   - Aprobación de solicitudes
   - Donación de sangre
   - Procesamiento de derivados
   - Marketplace

2. **Guardar estado de Anvil** (opcional):
   ```bash
   # Si quieres mantener el estado actual
   anvil --host 0.0.0.0 --disable-code-size-limit --dump-state anvil-state.json
   ```

3. **Deployment a testnet** (cuando esté listo):
   - Revisar `foundry/deploy-simple.ps1` para deployment en Trias Testnet
   - Actualizar `.env.local` con las nuevas direcciones de testnet

---

**Última actualización:** 16 de enero de 2026
**Red:** Anvil Local (localhost:8545)
**Chain ID:** 31337
