const fs = require('fs');
const path = require('path');

// Leer el archivo de broadcast más reciente del script Deploy
function getDeploymentData() {
    const broadcastDir = path.join(__dirname, 'broadcast', 'Deploy.s.sol', '31337', 'run-latest.json');

    if (!fs.existsSync(broadcastDir)) {
        throw new Error(`No se encontró el archivo de deployment en ${broadcastDir}\nAsegúrate de haber desplegado los contratos primero.`);
    }

    const broadcastLog = JSON.parse(fs.readFileSync(broadcastDir, 'utf8'));
    const transactions = broadcastLog.transactions;

    // Filtrar solo los deployments de contratos (function === null)
    const deployments = transactions.filter(tx =>
        tx.contractAddress &&
        tx.function === null &&
        tx.transactionType === 'CREATE'
    );

    // Los contratos se despliegan en este orden: Usuarios, Tokens, OliveOilCertification
    const usuariosAddress = deployments.find(d => d.contractName === 'Usuarios').contractAddress;
    const tokensAddress = deployments.find(d => d.contractName === 'Tokens').contractAddress;
    const certificateAddress = deployments.find(d => d.contractName === 'OliveOilCertification').contractAddress;

    return {
        usuariosAddress,
        tokensAddress,
        certificateAddress
    };
}

// Leer los ABIs desde los archivos compilados
const usuariosABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'out/Usuarios.sol/Usuarios.json'), 'utf8')).abi;
const tokensABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'out/Tokens.sol/Tokens.json'), 'utf8')).abi;
const certificateABI = JSON.parse(fs.readFileSync(path.join(__dirname, 'out/Certificate.sol/OliveOilCertification.json'), 'utf8')).abi;

// Obtener direcciones del deployment
const { usuariosAddress, tokensAddress, certificateAddress } = getDeploymentData();

console.log('📝 Direcciones de contratos detectadas:');
console.log('  Usuarios:', usuariosAddress);
console.log('  Tokens:', tokensAddress);
console.log('  OliveOilCertification:', certificateAddress);

// Crear el contenido del archivo contracts.ts
const content = `// Direcciones y ABIs de los contratos
// Actualizado automáticamente por update-contracts.js
export const CONTRACTS = {
  Usuarios: {
    address: "${usuariosAddress}",
    abi: ${JSON.stringify(usuariosABI, null, 2)}
  },
  Tokens: {
    address: "${tokensAddress}",
    abi: ${JSON.stringify(tokensABI, null, 2)}
  },
  Certificate: {
    address: "${certificateAddress}",
    abi: ${JSON.stringify(certificateABI, null, 2)}
  }
} as const;

// Exportaciones individuales para compatibilidad
export const USUARIOS_ADDRESS = "${usuariosAddress}";
export const TOKENS_ADDRESS = "${tokensAddress}";
export const CERTIFICATE_ADDRESS = "${certificateAddress}";

export const USUARIOS_ABI = ${JSON.stringify(usuariosABI, null, 2)};
export const TOKENS_ABI = ${JSON.stringify(tokensABI, null, 2)};
export const CERTIFICATE_ABI = ${JSON.stringify(certificateABI, null, 2)};
`;

// Escribir el archivo
const outputPath = path.join(__dirname, '../src/constants/contracts.ts');
fs.writeFileSync(outputPath, content);

console.log('\n✅ Archivo contracts.ts actualizado correctamente en', outputPath);
