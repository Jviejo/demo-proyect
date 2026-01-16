#!/bin/bash
# Script de verificación del frontend
# Verifica que las direcciones de contratos en .env.local coincidan con los contratos desplegados

echo "=== Verificación de Configuración del Frontend ==="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Leer variables de entorno
source .env.local 2>/dev/null

if [ -z "$NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS" ]; then
    echo -e "${RED}✗ Error: .env.local no encontrado o variables no configuradas${NC}"
    exit 1
fi

echo "1. Variables de entorno configuradas:"
echo -e "   ${GREEN}✓${NC} BloodTracker:    $NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS"
echo -e "   ${GREEN}✓${NC} BloodDonation:   $NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS"
echo -e "   ${GREEN}✓${NC} BloodDerivative: $NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS"
echo ""

# Verificar Anvil
echo "2. Verificando conexión con Anvil..."
BLOCK=$(cast block-number --rpc-url http://localhost:8545 2>&1)
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓${NC} Anvil está corriendo (bloque #$BLOCK)"
else
    echo -e "   ${RED}✗${NC} Anvil no está corriendo en http://localhost:8545"
    echo "     Inicia Anvil con: anvil --host 0.0.0.0 --disable-code-size-limit"
    exit 1
fi
echo ""

# Verificar contratos desplegados
echo "3. Verificando contratos desplegados..."

# BloodTracker
BT_CODE=$(cast code $NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS --rpc-url http://localhost:8545 2>&1)
if [ "$BT_CODE" != "0x" ] && [ ${#BT_CODE} -gt 10 ]; then
    echo -e "   ${GREEN}✓${NC} BloodTracker desplegado correctamente"
else
    echo -e "   ${RED}✗${NC} BloodTracker NO encontrado en $NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS"
fi

# BloodDonation
BD_CODE=$(cast code $NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS --rpc-url http://localhost:8545 2>&1)
if [ "$BD_CODE" != "0x" ] && [ ${#BD_CODE} -gt 10 ]; then
    echo -e "   ${GREEN}✓${NC} BloodDonation desplegado correctamente"
else
    echo -e "   ${RED}✗${NC} BloodDonation NO encontrado en $NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS"
fi

# BloodDerivative
BDER_CODE=$(cast code $NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS --rpc-url http://localhost:8545 2>&1)
if [ "$BDER_CODE" != "0x" ] && [ ${#BDER_CODE} -gt 10 ]; then
    echo -e "   ${GREEN}✓${NC} BloodDerivative desplegado correctamente"
else
    echo -e "   ${RED}✗${NC} BloodDerivative NO encontrado en $NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS"
fi
echo ""

# Verificar ownership
echo "4. Verificando ownership de contratos NFT..."

BD_OWNER=$(cast call $NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS "owner()" --rpc-url http://localhost:8545 2>&1 | tr '[:upper:]' '[:lower:]')
EXPECTED_OWNER=$(echo $NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS | tr '[:upper:]' '[:lower:]')

if [[ "$BD_OWNER" == *"$EXPECTED_OWNER"* ]]; then
    echo -e "   ${GREEN}✓${NC} BloodDonation ownership → BloodTracker"
else
    echo -e "   ${YELLOW}⚠${NC} BloodDonation owner: $BD_OWNER"
    echo "     Expected: $NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS"
fi

BDER_OWNER=$(cast call $NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS "owner()" --rpc-url http://localhost:8545 2>&1 | tr '[:upper:]' '[:lower:]')

if [[ "$BDER_OWNER" == *"$EXPECTED_OWNER"* ]]; then
    echo -e "   ${GREEN}✓${NC} BloodDerivative ownership → BloodTracker"
else
    echo -e "   ${YELLOW}⚠${NC} BloodDerivative owner: $BDER_OWNER"
    echo "     Expected: $NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS"
fi
echo ""

# Verificar archivos ABI
echo "5. Verificando archivos ABI..."

if [ -f "src/lib/contracts/BloodTracker.ts" ]; then
    BT_SIZE=$(wc -c < "src/lib/contracts/BloodTracker.ts")
    if [ $BT_SIZE -gt 1000 ]; then
        echo -e "   ${GREEN}✓${NC} BloodTracker.ts existe ($(numfmt --to=iec $BT_SIZE))"
    else
        echo -e "   ${YELLOW}⚠${NC} BloodTracker.ts parece muy pequeño"
    fi
else
    echo -e "   ${RED}✗${NC} BloodTracker.ts no encontrado"
fi

if [ -f "src/lib/contracts/BloodDonation.ts" ]; then
    BD_SIZE=$(wc -c < "src/lib/contracts/BloodDonation.ts")
    if [ $BD_SIZE -gt 1000 ]; then
        echo -e "   ${GREEN}✓${NC} BloodDonation.ts existe ($(numfmt --to=iec $BD_SIZE))"
    else
        echo -e "   ${YELLOW}⚠${NC} BloodDonation.ts parece muy pequeño"
    fi
else
    echo -e "   ${RED}✗${NC} BloodDonation.ts no encontrado"
fi

if [ -f "src/lib/contracts/BloodDerivative.ts" ]; then
    BDER_SIZE=$(wc -c < "src/lib/contracts/BloodDerivative.ts")
    if [ $BDER_SIZE -gt 1000 ]; then
        echo -e "   ${GREEN}✓${NC} BloodDerivative.ts existe ($(numfmt --to=iec $BDER_SIZE))"
    else
        echo -e "   ${YELLOW}⚠${NC} BloodDerivative.ts parece muy pequeño"
    fi
else
    echo -e "   ${RED}✗${NC} BloodDerivative.ts no encontrado"
fi
echo ""

# Verificar cuenta admin
echo "6. Verificando cuenta admin..."
ADMIN_BALANCE=$(cast balance $NEXT_PUBLIC_ADMIN_ADDRESS --rpc-url http://localhost:8545 2>&1)
if [ $? -eq 0 ]; then
    ADMIN_BALANCE_ETH=$(echo "scale=2; $ADMIN_BALANCE / 1000000000000000000" | bc)
    echo -e "   ${GREEN}✓${NC} Admin: $NEXT_PUBLIC_ADMIN_ADDRESS"
    echo "     Balance: ${ADMIN_BALANCE_ETH} ETH"
else
    echo -e "   ${YELLOW}⚠${NC} No se pudo verificar balance del admin"
fi
echo ""

echo "=== Resumen ==="
echo ""
echo "Configuración completa. Para iniciar el frontend:"
echo ""
echo "  npm run dev"
echo ""
echo "Asegúrate de configurar MetaMask:"
echo "  - RPC URL: http://localhost:8545"
echo "  - Chain ID: 31337"
echo "  - Cuenta: $NEXT_PUBLIC_ADMIN_ADDRESS"
echo ""
