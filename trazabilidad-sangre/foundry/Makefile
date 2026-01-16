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


