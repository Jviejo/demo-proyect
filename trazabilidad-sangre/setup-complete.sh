#!/bin/bash
set -e

echo "========================================"
echo "=== SETUP COMPLETO - UNA SOLA SESIÓN ==="
echo "========================================"

cd foundry

# 1. Deploy de contratos
echo ""
echo ">>> PASO 1: Desplegando contratos..."
INITIAL_ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
forge script script/DeployBloodWithAdmin.s.sol:DeployBloodWithAdmin \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast 2>&1 | tee /tmp/deploy-output.txt

# Extraer direcciones del output
TRACKER=$(grep "BloodTracker deployed at:" /tmp/deploy-output.txt | awk '{print $NF}')
DONATION=$(grep "BloodDonation deployed at:" /tmp/deploy-output.txt | awk '{print $NF}')
DERIVATIVE=$(grep "BloodDerivative deployed at:" /tmp/deploy-output.txt | awk '{print $NF}')

echo ""
echo "Direcciones desplegadas:"
echo "  BloodTracker: $TRACKER"
echo "  BloodDonation: $DONATION"
echo "  BloodDerivative: $DERIVATIVE"

# 2. Actualizar .env.local
echo ""
echo ">>> PASO 2: Actualizando .env.local..."
cd ..
cat > .env.local << EOF
NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS=$TRACKER
NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS=$DONATION
NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS=$DERIVATIVE
NEXT_PUBLIC_CHAIN_ID=31337
# Admin inicial (primera cuenta de Anvil)
NEXT_PUBLIC_ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
EOF
echo "✓ .env.local actualizado"

# 3. Registrar Centro de Donación
echo ""
echo ">>> PASO 3: Registrando Centro de Donación..."
cast send $TRACKER "requestSignUp(string,string,uint8)" "Centro de Donacion Madrid" "Madrid Centro" "1" \
  --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d \
  --rpc-url http://localhost:8545
echo "✓ Centro de Donación registrado"

# 4. Registrar Laboratorio
echo ""
echo ">>> PASO 4: Registrando Laboratorio..."
cast send $TRACKER "requestSignUp(string,string,uint8)" "Laboratorio Madrid" "Madrid Lab District" "2" \
  --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a \
  --rpc-url http://localhost:8545
echo "✓ Laboratorio registrado"

# 5. Aprobar Centro de Donación (Request ID: 1)
echo ""
echo ">>> PASO 5: Aprobando Centro de Donación..."
cast send $TRACKER "approveRequest(uint256)" "1" \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545
echo "✓ Centro de Donación aprobado"

# 6. Aprobar Laboratorio (Request ID: 2)
echo ""
echo ">>> PASO 6: Aprobando Laboratorio..."
cast send $TRACKER "approveRequest(uint256)" "2" \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545
echo "✓ Laboratorio aprobado"

# 7. Verificar permisos de admin
echo ""
echo ">>> PASO 7: Verificando permisos de admin..."
ADMIN=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
ADMIN_ROLE=$(cast keccak "ADMIN_ROLE")
HAS_ROLE=$(cast call $TRACKER "hasRole(bytes32,address)(bool)" $ADMIN_ROLE $ADMIN --rpc-url http://localhost:8545)

if [ "$HAS_ROLE" = "true" ]; then
  echo "✓ Admin tiene permisos ADMIN_ROLE correctamente"
else
  echo "✗ ERROR: Admin NO tiene permisos ADMIN_ROLE"
  exit 1
fi

echo ""
echo "========================================"
echo "=== SETUP COMPLETO EXITOSAMENTE ==="
echo "========================================"
echo ""
echo "Direcciones finales:"
echo "  BloodTracker: $TRACKER"
echo "  BloodDonation: $DONATION"
echo "  BloodDerivative: $DERIVATIVE"
echo "  Admin: $ADMIN"
echo ""
echo "Próximos pasos:"
echo "1. Reinicia el frontend (Ctrl+C y luego 'npm run dev')"
echo "2. Accede a http://localhost:3005/admin/approval-requests"
echo "3. Conecta MetaMask con la cuenta admin: $ADMIN"
echo ""
