# Instrucciones de Deployment - Blood Tracker

## Problema Actual

El deployment de los contratos desde Git Bash falla debido a un bug conocido de Foundry en Windows:
- Error: `IO error: not a terminal`
- El contrato BloodTracker excede el límite EIP-170 (28,765 bytes > 24,576 bytes)

## Solución: Usar PowerShell Nativo

### Opción 1: Ejecutar el script automático (Recomendado)

1. **Asegúrate de que Anvil esté corriendo:**
   ```bash
   # Desde Git Bash o PowerShell:
   anvil --host 0.0.0.0 --disable-code-size-limit
   ```

2. **Abre PowerShell (NO Git Bash):**
   - Presiona `Win + X` y selecciona "Windows PowerShell"
   - O busca "PowerShell" en el menú de inicio

3. **Navega al directorio del proyecto:**
   ```powershell
   cd C:\Users\andre\programacion\codecrypto\proyectos\demo-proyect\trazabilidad-sangre\foundry
   ```

4. **Ejecuta el script de deployment:**
   ```powershell
   .\deploy.ps1
   ```

   Si recibes un error de política de ejecución, ejecuta primero:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\deploy.ps1
   ```

### Opción 2: Comando manual desde PowerShell

```powershell
cd C:\Users\andre\programacion\codecrypto\proyectos\demo-proyect\trazabilidad-sangre\foundry
$env:INITIAL_ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
forge script script\DeploySimple.s.sol:DeploySimple --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast --legacy
```

## Direcciones de Contratos Esperadas

Después del deployment exitoso, deberías ver algo como:

```
=== Deployment Summary ===
BloodTracker: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
BloodDonation: 0x5FbDB2315678afecb367f032d93F642f64180aa3
BloodDerivative: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Initial Admin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**IMPORTANTE:** Copia estas direcciones y actualízalas en tu frontend.

## Verificar Deployment

Desde Git Bash o PowerShell:

```bash
# Verificar BloodTracker
cast code 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 --rpc-url http://localhost:8545

# Verificar BloodDonation
cast code 0x5FbDB2315678afecb367f032d93F642f64180aa3 --rpc-url http://localhost:8545

# Verificar BloodDerivative
cast code 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 --rpc-url http://localhost:8545
```

Si ves bytecode (no solo `0x`), el deployment fue exitoso.

## Alternativa: Usar WSL

Si tienes WSL instalado, también puedes ejecutar desde allí:

```bash
cd /mnt/c/Users/andre/programacion/codecrypto/proyectos/demo-proyect/trazabilidad-sangre/foundry
INITIAL_ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
forge script script/DeploySimple.s.sol:DeploySimple \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast --legacy
```

## Notas Técnicas

- El flag `--disable-code-size-limit` en Anvil es necesario porque BloodTracker (28.7KB) excede el límite EIP-170 (24.5KB)
- El flag `--legacy` usa transacciones tipo legacy en vez de EIP-1559
- La private key usada es la cuenta #0 por defecto de Anvil (10,000 ETH)
- El admin inicial es la misma cuenta #0 de Anvil
