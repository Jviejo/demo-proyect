# Guía de Uso: Script de Seed Data para Hospital y Manufacturer

Este documento explica cómo usar el script `SeedHospitalManufacturer.s.sol` para crear un entorno completo de testing con datos de Hospital y Manufacturer.

## Descripción

El script crea un escenario completo que incluye:

1. ✅ Registro y aprobación de Hospital y Manufacturer
2. ✅ Creación de 5 donaciones
3. ✅ Procesamiento de 3 bolsas en derivados (9 derivados totales)
4. ✅ Listado de items en marketplace (2 bolsas + 6 derivados)
5. ✅ Hospital compra 1 bolsa + 2 derivados
6. ✅ Manufacturer compra 3 derivados
7. ✅ Hospital administra a 2 pacientes
8. ✅ Manufacturer crea 1 lote de producto cosmético

## Ejecutar Setup Completo (Recommended)

La forma más fácil es ejecutar todo en orden:

```bash
cd foundry

# 1. Asegúrate de que Anvil esté corriendo
# En otra terminal: anvil --host 0.0.0.0

# 2. Deploy contratos
export INITIAL_ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
forge script script/DeployBloodWithAdmin.s.sol:DeployBloodWithAdmin --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# 3. Copiar las nuevas direcciones a .env.local y al script SeedHospitalManufacturer.s.sol

# 4. Registrar y aprobar Centro de Donación (cuenta 1)
cast send <TRACKER_ADDRESS> "requestSignUp(string,string,uint8)" "Centro Donaciones" "Madrid" "1" --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d --rpc-url http://localhost:8545
cast send <TRACKER_ADDRESS> "approveRequest(uint256)" "1" --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545

# 5. Registrar y aprobar Laboratorio (cuenta 2)
cast send <TRACKER_ADDRESS> "requestSignUp(string,string,uint8)" "Laboratorio Bio" "Madrid" "2" --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a --rpc-url http://localhost:8545
cast send <TRACKER_ADDRESS> "approveRequest(uint256)" "2" --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545

# 6. Ejecutar script de seed data
forge script script/SeedHospitalManufacturer.s.sol:SeedHospitalManufacturer --rpc-url http://localhost:8545 --broadcast -vv
```

## Ver Resultados en Frontend

```bash
npm run dev
# Conectar MetaMask con cuenta 3 (Hospital) o cuenta 4 (Manufacturer)
```

## Cuentas de Anvil Usadas

| Rol | Address | Cuenta # |
|-----|---------|----------|
| Admin | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0 |
| Donation Center | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 1 |
| Laboratory | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 2 |
| Hospital | 0x90F79bf6EB2c4f870365E785982E1f101E93b906 | 3 |
| Manufacturer | 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 | 4 |

