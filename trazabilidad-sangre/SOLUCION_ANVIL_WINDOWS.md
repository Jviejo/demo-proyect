# Solución: Problema con Anvil en Windows

## 🔴 Problema Identificado

**Anvil se reinicia constantemente** entre comandos en Windows, causando que:
- Los contratos desplegados desaparezcan
- El panel de admin no funcione
- No se puedan hacer pruebas

## ✅ Solución Recomendada

### Opción 1: Anvil con Estado Persistente (RECOMENDADO)

Ejecuta Anvil con un archivo de estado para mantener los datos entre reinicios:

```bash
# En una terminal separada, ejecuta:
anvil --host 0.0.0.0 --state-interval 1 --dump-state anvil-state.json

# Esto guardará el estado cada segundo en anvil-state.json
```

**Para restaurar el estado después**:
```bash
anvil --host 0.0.0.0 --load-state anvil-state.json
```

### Opción 2: Script de Deployment Completo en Una Sola Sesión

Crea un archivo `setup-completo.bat` en la raíz del proyecto:

```batch
@echo off
echo ====================================
echo Setup Completo - Una Sola Sesion
echo ====================================

cd foundry

REM Deployment
set INITIAL_ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
forge script script/DeployBloodWithAdmin.s.sol:DeployBloodWithAdmin --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast > deploy-output.txt

REM Extraer direcciones (debes hacerlo manual o con PowerShell)
echo.
echo Revisa deploy-output.txt para las direcciones de los contratos
echo Actualiza manualmente .env.local con las nuevas direcciones
echo.
pause

REM Registrar Centro de Donación
cast send TRACKER_ADDRESS "requestSignUp(string,string,uint8)" "Centro" "Madrid" "1" --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d --rpc-url http://localhost:8545

REM Registrar Laboratorio
cast send TRACKER_ADDRESS "requestSignUp(string,string,uint8)" "Lab" "Madrid" "2" --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a --rpc-url http://localhost:8545

REM Aprobar
cast send TRACKER_ADDRESS "approveRequest(uint256)" "1" --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545
cast send TRACKER_ADDRESS "approveRequest(uint256)" "2" --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545

echo.
echo ====================================
echo Setup completo!
echo ====================================
pause
```

### Opción 3: Usar Docker para Anvil (MÁS ESTABLE)

```bash
# Crear un docker-compose.yml
version: '3.8'
services:
  anvil:
    image: ghcr.io/foundry-rs/foundry:latest
    command: anvil --host 0.0.0.0
    ports:
      - "8545:8545"
    volumes:
      - anvil-data:/root/.foundry

volumes:
  anvil-data:
```

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Opción 4: Usar Testnet Real (PARA PRODUCCIÓN)

En lugar de Anvil local, usa Trias Testnet que ya tienes configurada:

1. Actualiza `.env.local`:
```env
NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS=<dirección en Trias>
NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS=<dirección en Trias>
NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS=<dirección en Trias>
NEXT_PUBLIC_CHAIN_ID=<chain ID de Trias>
```

2. Despliega en Trias:
```bash
cd foundry
make deploy-tsc-admin
```

## 🎯 Paso a Paso: Setup Manual Completo

### 1. Iniciar Anvil con Estado Persistente

```bash
anvil --host 0.0.0.0 --state-interval 1 --dump-state anvil-state.json
```

**IMPORTANTE**: Deja esta terminal abierta todo el tiempo.

### 2. En OTRA terminal, ejecutar todo el setup

```bash
cd foundry

# 1. Deploy
export INITIAL_ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
forge script script/DeployBloodWithAdmin.s.sol:DeployBloodWithAdmin --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# ANOTAR LAS DIRECCIONES QUE APARECEN

# 2. Actualizar .env.local manualmente con las nuevas direcciones

# 3. Registrar entidades (reemplaza TRACKER con la dirección real)
TRACKER=0x...
cast send $TRACKER "requestSignUp(string,string,uint8)" "Centro" "Madrid" "1" --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d --rpc-url http://localhost:8545

cast send $TRACKER "requestSignUp(string,string,uint8)" "Lab" "Madrid" "2" --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a --rpc-url http://localhost:8545

# 4. Aprobar solicitudes
cast send $TRACKER "approveRequest(uint256)" "1" --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545

cast send $TRACKER "approveRequest(uint256)" "2" --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545
```

### 3. Reiniciar el frontend

```bash
# Detener el frontend actual (Ctrl+C en la terminal donde corre)
npm run dev
```

### 4. Probar en el navegador

1. Ir a http://localhost:3005/admin/approval-requests
2. La cuenta de admin debería tener acceso ahora

## 📋 Información de la Cuenta Admin

```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## 🔍 Verificar que Admin Tiene Permisos

```bash
TRACKER=<dirección_del_tracker>
ADMIN=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
ADMIN_ROLE=$(cast keccak "ADMIN_ROLE")

# Verificar rol
cast call $TRACKER "hasRole(bytes32,address)(bool)" $ADMIN_ROLE $ADMIN --rpc-url http://localhost:8545

# Debería devolver: true
```

## ❓ Troubleshooting

### Problema: "Acceso Denegado" en /admin/approval-requests

**Causa**: La cuenta no tiene el rol ADMIN_ROLE en el contrato.

**Solución**:
1. Verificar que usaste la dirección correcta en INITIAL_ADMIN_ADDRESS durante el deployment
2. Verificar que el frontend esté usando la dirección correcta del contrato (ver .env.local)
3. Reiniciar el frontend después de actualizar .env.local

### Problema: "contract does not have any code"

**Causa**: Anvil se reinició y perdió el estado.

**Solución**: Usar Anvil con estado persistente (Opción 1 arriba).

### Problema: Frontend no refleja cambios

**Causa**: Next.js tiene caché.

**Solución**:
```bash
rm -rf .next
npm run dev
```

## 🎯 Recomendación Final

Para desarrollo estable en Windows, te recomiendo:

1. **Usar Docker para Anvil** (Opción 3) - Más estable
2. **O usar Trias Testnet** (Opción 4) - Para testing real

Para pruebas rápidas locales:
- Usar Anvil con estado persistente (Opción 1)
- Ejecutar todo el setup en una sola sesión de terminal sin cerrarla

---

**Generado**: 16 de Enero 2026
**Problema**: Anvil reiniciándose en Windows
**Estado**: Documentado con soluciones
