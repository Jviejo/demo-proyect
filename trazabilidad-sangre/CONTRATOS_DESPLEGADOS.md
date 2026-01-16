# Contratos Desplegados - Anvil Local

## Resumen del Deployment

**Fecha:** 16 de enero de 2026
**Red:** Anvil Local (http://localhost:8545)
**Chain ID:** 31337
**Método:** Deployment manual usando `cast send` (evita bug de Foundry en Windows)

---

## Direcciones de Contratos

### BloodDonation (ERC721)
```
0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
```
- **Tipo:** NFT que representa unidades de sangre donada
- **Owner:** BloodTracker (0xa513E6E4b8f2a923D98304ec87F64353C4D5C853)
- **Block:** #9
- **Gas Used:** 2,407,902

### BloodDerivative (ERC721)
```
0x0165878A594ca255338adfa4d48449f69242Eb8F
```
- **Tipo:** NFT que representa derivados de sangre (Plasma, Eritrocitos, Plaquetas)
- **Owner:** BloodTracker (0xa513E6E4b8f2a923D98304ec87F64353C4D5C853)
- **Block:** #11
- **Gas Used:** 2,401,485

### BloodTracker (Contrato Principal)
```
0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
```
- **Tipo:** Contrato principal de gestión y marketplace
- **Initial Admin:** 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Cuenta Anvil #0)
- **Block:** #12
- **Gas Used:** 6,435,551
- **Nota:** Excede límite EIP-170 (28,765 bytes > 24,576 bytes límite)

---

## Configuración del Sistema

### Admin Principal
```
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```
- Balance: 10,000 ETH (cuenta #0 de Anvil)
- Roles: DEFAULT_ADMIN_ROLE en BloodTracker
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### Roles del Sistema
- **DEFAULT_ADMIN_ROLE:** `0x0000...0000`
- **DONATION_CENTER:** `0x7613a25ecc738585a232ad50a301178f12b3ba8887d13e138b523c4269c47689`
- **LABORATORY:** `0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775`

---

## Verificación de Deployment

### Verificar que los contratos están desplegados:

```bash
# BloodDonation
cast code 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 --rpc-url http://localhost:8545

# BloodDerivative
cast code 0x0165878A594ca255338adfa4d48449f69242Eb8F --rpc-url http://localhost:8545

# BloodTracker
cast code 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853 --rpc-url http://localhost:8545
```

### Verificar ownership:

```bash
# Owner de BloodDonation (debe ser BloodTracker)
cast call 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 "owner()" --rpc-url http://localhost:8545

# Owner de BloodDerivative (debe ser BloodTracker)
cast call 0x0165878A594ca255338adfa4d48449f69242Eb8F "owner()" --rpc-url http://localhost:8545

# Admin de BloodTracker
cast call 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853 \
  "hasRole(bytes32,address)" \
  0x0000000000000000000000000000000000000000000000000000000000000000 \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  --rpc-url http://localhost:8545
```

---

## Actualizar Frontend

Actualiza las direcciones en tu archivo de configuración del frontend:

```typescript
// src/lib/contracts/addresses.ts o similar
export const CONTRACTS = {
  BloodTracker: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
  BloodDonation: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  BloodDerivative: "0x0165878A594ca255338adfa4d48449f69242Eb8F"
};
```

---

## Mantener Anvil Corriendo

### Iniciar Anvil con estado guardado:
```bash
anvil --host 0.0.0.0 --disable-code-size-limit --load-state anvil-state.json
```

### Guardar estado actual:
```bash
# Anvil debe estar corriendo con --dump-state anvil-state.json
# O hacer backup manual cuando sea necesario
```

---

## Notas Técnicas

1. **Límite de Tamaño:** BloodTracker requiere `--disable-code-size-limit` en Anvil debido a su tamaño (28.7KB > 24.5KB límite EIP-170)

2. **Bug de Windows:** El deployment se hizo manualmente con `cast send` debido al bug "IO error: not a terminal" en `forge script` en Windows con Git Bash

3. **Ownership:** Los contratos NFT (BloodDonation y BloodDerivative) son propiedad del contrato BloodTracker, lo que permite que BloodTracker haga mint y burn de tokens

4. **Scripts Disponibles:**
   - `foundry/deploy-simple.ps1` - Script de PowerShell para deployment
   - `foundry/deploy_bloodtracker.py` - Script Python para desplegar BloodTracker
   - `foundry/script/DeploySimple.s.sol` - Script de Foundry (requiere PowerShell)

---

## Estado de la Red

**Último Bloque:** #14
**Total Gas Usado:** ~13,244,938
**Estado:** Todos los contratos desplegados y configurados correctamente ✓
