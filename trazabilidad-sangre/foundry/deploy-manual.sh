#!/bin/bash
# Manual deployment script using cast send
# This avoids the "IO error: not a terminal" bug in forge script on Windows

set -e

RPC_URL="http://localhost:8545"
PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
ADMIN_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

echo "=== Blood Tracker Manual Deployment ==="
echo ""
echo "Deploying to: $RPC_URL"
echo "Admin address: $ADMIN_ADDRESS"
echo ""

cd foundry

# Deploy BloodDonation
echo "1. Deploying BloodDonation..."
BD_BYTECODE=$(forge inspect foundry/src/BloodDonation.sol:BloodDonation bytecode)
BD_TX=$(cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY --create "$BD_BYTECODE" --json)
BD_ADDRESS=$(echo $BD_TX | python -c "import json, sys; print(json.load(sys.stdin)['contractAddress'])")
echo "   BloodDonation deployed at: $BD_ADDRESS"
echo ""

# Deploy BloodDerivative
echo "2. Deploying BloodDerivative..."
BDER_BYTECODE=$(forge inspect foundry/src/BloodDerivative.sol:BloodDerivative bytecode)
BDER_TX=$(cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY --create "$BDER_BYTECODE" --json)
BDER_ADDRESS=$(echo $BDER_TX | python -c "import json, sys; print(json.load(sys.stdin)['contractAddress'])")
echo "   BloodDerivative deployed at: $BDER_ADDRESS"
echo ""

# Encode constructor arguments for BloodTracker
echo "3. Preparing BloodTracker deployment..."
CONSTRUCTOR_ARGS=$(cast abi-encode "constructor(address,address,address)" $BD_ADDRESS $BDER_ADDRESS $ADMIN_ADDRESS | sed 's/0x//')
BT_BYTECODE=$(forge inspect foundry/src/BloodTracker.sol:BloodTracker bytecode | tr -d '\n')

echo "4. Deploying BloodTracker (this may take a moment due to large contract size)..."
BT_FULL="${BT_BYTECODE}${CONSTRUCTOR_ARGS}"
BT_TX=$(cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY --create "$BT_FULL" --json --gas-limit 10000000)
BT_ADDRESS=$(echo $BT_TX | python -c "import json, sys; print(json.load(sys.stdin)['contractAddress'])")
echo "   BloodTracker deployed at: $BT_ADDRESS"
echo ""

# Transfer ownership of BloodDonation to BloodTracker
echo "5. Transferring BloodDonation ownership to BloodTracker..."
cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY $BD_ADDRESS "transferOwnership(address)" $BT_ADDRESS
echo "   Ownership transferred"
echo ""

# Transfer ownership of BloodDerivative to BloodTracker
echo "6. Transferring BloodDerivative ownership to BloodTracker..."
cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY $BDER_ADDRESS "transferOwnership(address)" $BT_ADDRESS
echo "   Ownership transferred"
echo ""

echo "=== Deployment Summary ==="
echo "BloodDonation:   $BD_ADDRESS"
echo "BloodDerivative: $BDER_ADDRESS"
echo "BloodTracker:    $BT_ADDRESS"
echo "Initial Admin:   $ADMIN_ADDRESS"
echo ""
echo "Deployment completed successfully!"
