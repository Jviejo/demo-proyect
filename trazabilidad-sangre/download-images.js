#!/usr/bin/env node

/**
 * Script para descargar imágenes de Unsplash y convertirlas a WebP
 * Uso: node download-images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Mapeo de URLs de Unsplash a rutas locales
const imageMap = {
  // Company
  'https://images.unsplash.com/photo-1579154204845-3069a0c8f004?w=1920&q=80':
    'public/images/content/company/hero.webp',
  'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80':
    'public/images/content/company/lab.webp',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80':
    'public/images/content/company/values-1.webp',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80':
    'public/images/content/company/values-2.webp',

  // Team
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80':
    'public/images/content/team/team-hero.webp',

  // Our Promise (4 imágenes)
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80':
    'public/images/content/promises/fast-delivery.webp',
  'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80':
    'public/images/content/promises/secure-tracking.webp',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80':
    'public/images/content/promises/realtime-updates.webp',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80':
    'public/images/content/promises/easy-to-use.webp',

  // Services (4 imágenes)
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80':
    'public/images/content/services/consultancy.webp',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80':
    'public/images/content/services/implementation.webp',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80':
    'public/images/content/services/infrastructure.webp',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80':
    'public/images/content/services/development.webp',
};

/**
 * Descarga una imagen desde una URL y la guarda en el sistema de archivos
 */
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Crear directorios si no existen
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`⬇️  Descargando: ${path.basename(outputPath)}...`);

    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ Guardado: ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Eliminar archivo incompleto
      reject(err);
    });
  });
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando descarga de imágenes desde Unsplash...\n');
  console.log(`📦 Total de imágenes a descargar: ${Object.keys(imageMap).length}\n`);

  let downloaded = 0;
  let failed = 0;

  for (const [url, outputPath] of Object.entries(imageMap)) {
    try {
      // Verificar si el archivo ya existe
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  Ya existe: ${outputPath}`);
        continue;
      }

      await downloadImage(url, outputPath);
      downloaded++;

      // Pequeña pausa para no sobrecargar Unsplash
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error descargando ${outputPath}:`, error.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Resumen:');
  console.log(`✅ Descargadas: ${downloaded}`);
  console.log(`⏭️  Ya existían: ${Object.keys(imageMap).length - downloaded - failed}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n🎉 ¡Todas las imágenes se descargaron correctamente!');
  } else {
    console.log('\n⚠️  Algunas imágenes fallaron. Revisa los errores arriba.');
  }
}

// Ejecutar
main().catch(console.error);
