#!/bin/bash

# Archivo de salida para las direcciones
forge script script/All_Contracts__Deploy.s.sol:DeployAllContracts --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url https://rpc.codecrypto.academy --broadcast


echo "¿Has copiado y pegado las direcciones de los contratos en el archivo .env? (Y/N)"
read response

if [ "$response" = "Y" ] || [ "$response" = "y" ]; then
    echo "Continuando con la ejecución..."
else
    echo "Por favor, copia las direcciones de los contratos en el archivo .env antes de continuar"
    exit 1
fi

echo "Añadiendo roles"
node scripts/createUsers.js 

echo "Añadiendo raw minerals"
node scripts/createRawMinerals.js
