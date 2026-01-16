# Script de deployment para Windows PowerShell
# Ejecutar desde PowerShell (NO desde Git Bash)

Write-Host "=== Blood Tracker Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que Anvil está corriendo
Write-Host "Verificando conexión a Anvil..." -ForegroundColor Yellow
try {
    $blockNumber = cast block-number --rpc-url http://localhost:8545 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Anvil está corriendo en el bloque: $blockNumber" -ForegroundColor Green
    } else {
        Write-Host "✗ Error: Anvil no está corriendo en http://localhost:8545" -ForegroundColor Red
        Write-Host "  Ejecuta primero: anvil --host 0.0.0.0 --disable-code-size-limit" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "✗ Error al conectar con Anvil" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Iniciando deployment de contratos..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar el script de deployment
$env:INITIAL_ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

forge script script\DeploySimple.s.sol:DeploySimple `
    --rpc-url http://localhost:8545 `
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 `
    --broadcast `
    --legacy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Deployment completado ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifica las direcciones en el output anterior" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "=== Deployment falló ===" -ForegroundColor Red
    Write-Host "Revisa los errores anteriores" -ForegroundColor Yellow
}
