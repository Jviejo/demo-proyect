Set-Location "C:\Users\andre\programacion\codecrypto\proyectos\demo-proyect\trazabilidad-sangre\foundry"

Write-Host "Blood Tracker Deployment Script"
Write-Host ""
Write-Host "Checking Anvil connection..."
$blockNumber = cast block-number --rpc-url http://localhost:8545 2>&1
Write-Host "Anvil is running at block: $blockNumber"
Write-Host ""
Write-Host "Starting deployment..."
Write-Host ""

$env:INITIAL_ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

forge script script\DeploySimple.s.sol:DeploySimple --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast --legacy

Write-Host ""
Write-Host "Deployment finished. Check output above for contract addresses."
