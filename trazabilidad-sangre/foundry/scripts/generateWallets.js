/**
 * Script para generar wallets determinísticas para testing del sistema de trazabilidad de sangre
 * Genera 10 wallets usando un mnemonic BIP-39 y las guarda en formato JSON
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Configuración
const NETWORK = 'besu-codecrypto';
const CHAIN_ID = 81234;
const DERIVATION_PATH = "m/44'/60'/0'/0/"; // Ethereum standard
const MNEMONIC = "test test test test test test test test test test test junk"; // Standard test mnemonic

// Definición de roles y wallets
const WALLET_CONFIGS = [
  // DONATION_CENTERS (3)
  {
    role: 'DONATION_CENTER',
    name: 'Centro Donación Madrid',
    location: 'Madrid, España'
  },
  {
    role: 'DONATION_CENTER',
    name: 'Centro Donación Barcelona',
    location: 'Barcelona, España'
  },
  {
    role: 'DONATION_CENTER',
    name: 'Centro Donación Valencia',
    location: 'Valencia, España'
  },
  // LABORATORIES (2)
  {
    role: 'LABORATORY',
    name: 'Laboratorio Central',
    location: 'Madrid, España'
  },
  {
    role: 'LABORATORY',
    name: 'Laboratorio Regional Norte',
    location: 'Bilbao, España'
  },
  // TRADERS (2)
  {
    role: 'TRADER',
    name: 'Trader Alpha Bio',
    location: 'Barcelona, España'
  },
  {
    role: 'TRADER',
    name: 'Trader Beta Med',
    location: 'Valencia, España'
  },
  // HOSPITALS (2)
  {
    role: 'HOSPITAL',
    name: 'Hospital General Universitario',
    location: 'Madrid, España'
  },
  {
    role: 'HOSPITAL',
    name: 'Hospital Clínico Provincial',
    location: 'Barcelona, España'
  },
  // MANUFACTURER (1)
  {
    role: 'MANUFACTURER',
    name: 'Cosmetics Plasma Corp',
    location: 'Valencia, España'
  }
];

async function generateWallets() {
  console.log('🔐 Generando wallets determinísticas...\n');

  const wallets = [];

  for (let i = 0; i < WALLET_CONFIGS.length; i++) {
    const config = WALLET_CONFIGS[i];

    // Derivar wallet usando el path completo desde el mnemonic
    const derivedPath = `${DERIVATION_PATH}${i}`;
    const wallet = ethers.HDNodeWallet.fromPhrase(MNEMONIC, undefined, derivedPath);

    const walletInfo = {
      index: i,
      role: config.role,
      name: config.name,
      location: config.location,
      address: wallet.address,
      privateKey: wallet.privateKey,
      derivationPath: derivedPath
    };

    wallets.push(walletInfo);

    console.log(`✅ Wallet ${i}: ${config.role}`);
    console.log(`   Nombre: ${config.name}`);
    console.log(`   Address: ${wallet.address}`);
    console.log(`   Path: ${derivedPath}\n`);
  }

  // Crear objeto completo para guardar
  const output = {
    network: NETWORK,
    chainId: CHAIN_ID,
    generatedAt: new Date().toISOString(),
    mnemonic: MNEMONIC,
    derivationPath: DERIVATION_PATH,
    wallets: wallets,
    summary: {
      total: wallets.length,
      byRole: {
        DONATION_CENTER: wallets.filter(w => w.role === 'DONATION_CENTER').length,
        LABORATORY: wallets.filter(w => w.role === 'LABORATORY').length,
        TRADER: wallets.filter(w => w.role === 'TRADER').length,
        HOSPITAL: wallets.filter(w => w.role === 'HOSPITAL').length,
        MANUFACTURER: wallets.filter(w => w.role === 'MANUFACTURER').length
      }
    }
  };

  // Guardar en archivo .clientWallets
  const outputPath = path.join(__dirname, '..', '.clientWallets');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log('✨ Wallets generadas exitosamente!');
  console.log(`📁 Guardadas en: ${outputPath}`);
  console.log('\n📊 Resumen:');
  console.log(`   Total wallets: ${output.summary.total}`);
  Object.entries(output.summary.byRole).forEach(([role, count]) => {
    console.log(`   ${role}: ${count}`);
  });
  console.log('\n⚠️  IMPORTANTE:');
  console.log('   1. Este archivo contiene claves privadas - NO lo versiones en git');
  console.log('   2. Solo para testing/desarrollo - NUNCA usar en producción');
  console.log('   3. Copiar manualmente las wallets al script SeedDataComplete.s.sol');
}

// Ejecutar
generateWallets().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
