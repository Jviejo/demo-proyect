-include .anvil-env
-include .env
export

ARGS ?= "Dodot", "Madrid", 1
WALLET ?= ""
REQUEST_ID ?= 1
NUM_DONORS ?= 50

# Deployment con admin (nuevo sistema de aprobación)
deploy-anvil-admin:;
	forge script script/DeployBloodWithAdmin.s.sol:DeployBloodWithAdmin --rpc-url $(ANVIL_RPC_URL) --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

deploy-tsc-admin:;
	forge script script/DeployBloodWithAdmin.s.sol:DeployBloodWithAdmin --legacy --rpc-url $(TRIAS_RPC_URL) --account trias-testnet --password-file .password  --broadcast

# Deployment antiguo (sin admin) - deprecated
deploy-anvil:;
	forge script script/DeployBlood_Anvil.s.sol:DeployBlood --rpc-url $(ANVIL_RPC_URL) --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

deploy-tsc:;
	forge script script/DeployBlood.s.sol:DeployBlood --legacy --rpc-url $(TRIAS_RPC_URL) --account trias-testnet --password-file .password  --broadcast 

script-run:;
	forge script script/Actions.s.sol:Actions --legacy --rpc-url $(TRIAS_RPC_URL) --account trias-testnet --password-file .password 

# Solicitud de registro (nuevo sistema)
script-requestSignUp:;
	forge script script/Actions.s.sol:Actions $(SIGNUP) -s "requestSignUp(string,string,uint8)" --legacy --rpc-url $(TRIAS_RPC_URL) --account $(WALLET) --password-file .password --broadcast

# Comando antiguo (deprecated)
script-signUp:;
	@echo "DEPRECATED: Use script-requestSignUp en su lugar"
	forge script script/Actions.s.sol:Actions $(SIGNUP) -s "requestSignUp(string,string,uint8)" --legacy --rpc-url $(TRIAS_RPC_URL) --account $(WALLET) --password-file .password --broadcast

script-donate:;
	forge script script/Actions.s.sol:Actions $(ARGS) -s "donate(address)" --legacy --rpc-url $(TRIAS_RPC_URL) --account $(WALLET) --password-file .password --broadcast

# Tests
test-approval:;
	forge test --match-contract BloodTrackerApprovalTest -vv

test-all:;
	forge test -vv

# Seed Data - Generar datos de prueba
seed-data-anvil:;
	@echo "Generando datos de prueba en Anvil..."
	forge script script/SeedData.s.sol:SeedData --rpc-url $(ANVIL_RPC_URL) --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast -vvvv

seed-data-tsc:;
	@echo "Generando datos de prueba en Trias Testnet..."
	forge script script/SeedData.s.sol:SeedData --legacy --rpc-url $(TRIAS_RPC_URL) --account trias-testnet --password-file .password --broadcast -vvvv

# Seed Data Hospital & Manufacturer - Escenario completo de testing
seed-hospital-manufacturer-anvil:;
	@echo "Generando escenario completo Hospital & Manufacturer en Anvil..."
	@echo "NOTA: Asegúrate de tener un Centro de Donación y Laboratorio registrados y aprobados"
	forge script script/SeedHospitalManufacturer.s.sol:SeedHospitalManufacturer --rpc-url $(ANVIL_RPC_URL) --broadcast -vvvv

seed-hospital-manufacturer-tsc:;
	@echo "Generando escenario completo Hospital & Manufacturer en Trias Testnet..."
	@echo "NOTA: Asegúrate de tener un Centro de Donación y Laboratorio registrados y aprobados"
	forge script script/SeedHospitalManufacturer.s.sol:SeedHospitalManufacturer --legacy --rpc-url $(TRIAS_RPC_URL) --broadcast -vvvv

# ============================================
# BESU CODECRYPTO (Chain ID: 81234)
# ============================================

# Verificar conexión a Besu
verify-besu:;
	@echo "Verificando conexión a Besu CodeCrypto..."
	cast block latest --rpc-url $(BESU_RPC_URL)
	@echo "\nChain ID:"
	cast chain-id --rpc-url $(BESU_RPC_URL)

# Deployment de contratos en Besu
deploy-besu-admin:;
	@echo "Desplegando contratos en Besu CodeCrypto..."
	INITIAL_ADMIN_ADDRESS=$(BESU_ADMIN_ADDRESS) forge script script/DeployBloodWithAdmin.s.sol:DeployBloodWithAdmin \
		--rpc-url $(BESU_RPC_URL) \
		--private-key $(BESU_PRIVATE_KEY) \
		--broadcast \
		-vvv

# Seed Data para Besu
seed-data-besu:;
	@echo "Generando datos de prueba en Besu..."
	forge script script/SeedData.s.sol:SeedData \
		--rpc-url $(BESU_RPC_URL) \
		--private-key $(BESU_PRIVATE_KEY) \
		--broadcast \
		-vvvv

# Seed Hospital & Manufacturer para Besu
seed-hospital-manufacturer-besu:;
	@echo "Generando escenario completo Hospital & Manufacturer en Besu..."
	@echo "NOTA: Asegúrate de tener un Centro de Donación y Laboratorio registrados y aprobados"
	forge script script/SeedHospitalManufacturer.s.sol:SeedHospitalManufacturer \
		--rpc-url $(BESU_RPC_URL) \
		--private-key $(BESU_PRIVATE_KEY) \
		--broadcast \
		-vvvv

# ============================================
# SEED COMPLETO - Batería completa de datos
# ============================================

# Generar wallets para testing
generate-wallets:;
	@echo "Generando wallets de testing..."
	@echo "Este comando creará 10 wallets determinísticas con claves privadas"
	@echo "Las wallets se guardarán en foundry/.clientWallets"
	@echo ""
	cd scripts && node generateWallets.js
	@echo ""
	@echo "✅ Wallets generadas exitosamente!"
	@echo ""
	@echo "⚠️  PRÓXIMOS PASOS:"
	@echo "1. Abrir el archivo foundry/.clientWallets"
	@echo "2. Copiar manualmente las addresses y privateKeys al script SeedDataComplete.s.sol"
	@echo "3. Ejecutar: make seed-complete-besu (o make seed-complete-anvil para testing)"

# Seed completo en Besu
seed-complete-besu:;
	@echo "=========================================="
	@echo "SEED COMPLETO - Besu CodeCrypto"
	@echo "=========================================="
	@echo ""
	@echo "Este script ejecutará:"
	@echo "  - Funding de 10 wallets (1000 ETH c/u)"
	@echo "  - Registro de todas las wallets con sus roles"
	@echo "  - Creación de 150 donaciones"
	@echo "  - Procesamiento de 20 derivados"
	@echo "  - Configuración de marketplace"
	@echo ""
	@echo "⏱️  Duración estimada: 5-10 minutos"
	@echo ""
	@read -p "Presiona Enter para continuar..."
	forge script script/SeedDataComplete.s.sol:SeedDataComplete \
		--rpc-url $(BESU_RPC_URL) \
		--private-key $(BESU_PRIVATE_KEY) \
		--broadcast \
		-vvvv

# Seed completo en Anvil (para testing)
seed-complete-anvil:;
	@echo "=========================================="
	@echo "SEED COMPLETO - Anvil Local"
	@echo "=========================================="
	@echo ""
	@echo "Este script ejecutará el seed completo en Anvil local"
	@echo "NOTA: Asegúrate de que Anvil esté corriendo (anvil --host 0.0.0.0)"
	@echo ""
	forge script script/SeedDataComplete.s.sol:SeedDataComplete \
		--rpc-url $(ANVIL_RPC_URL) \
		--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
		--broadcast \
		-vvvv


