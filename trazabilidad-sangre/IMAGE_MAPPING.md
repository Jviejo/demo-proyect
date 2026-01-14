# Mapeo de Imágenes del Proyecto

Este documento describe todas las imágenes descargadas y su ubicación en el proyecto.

## 📁 Company (`/company`)

| Archivo | Descripción | URL Original | Tamaño |
|---------|-------------|--------------|--------|
| `hero.webp` | Hero image - Laboratorio médico moderno | [Unsplash](https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1920&q=80) | 324K |
| `lab.webp` | Imagen de laboratorio de sangre | [Unsplash](https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80) | 41K |
| `values-1.webp` | Valores - Colaboración en equipo | [Unsplash](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80) | 77K |
| `values-2.webp` | Valores - Tecnología e innovación | [Unsplash](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80) | 64K |

## 👥 Team (`/team`)

| Archivo | Descripción | URL Original | Tamaño |
|---------|-------------|--------------|--------|
| `team-hero.webp` | Hero image del equipo | [Unsplash](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80) | 350K |

## 🎯 Our Promise (`/our-promise`)

| Archivo | Descripción | URL Original | Tamaño |
|---------|-------------|--------------|--------|
| `fast-delivery.webp` | Promesa: Entrega rápida | [Unsplash](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80) | 163K |
| `secure-tracking.webp` | Promesa: Trazabilidad segura | [Unsplash](https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80) | 68K |
| `realtime-updates.webp` | Promesa: Actualizaciones en tiempo real | [Unsplash](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80) | 64K |
| `easy-to-use.webp` | Promesa: Fácil de usar | [Unsplash](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80) | 64K |

## 🛠️ Services (`/servicios`)

| Archivo | Descripción | URL Original | Tamaño |
|---------|-------------|--------------|--------|
| `consultancy.webp` | Servicio: Consultoría | [Unsplash](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80) | 56K |
| `implementation.webp` | Servicio: Implementación | [Unsplash](https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80) | 48K |
| `infrastructure.webp` | Servicio: Infraestructura | [Unsplash](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80) | 88K |
| `development.webp` | Servicio: Desarrollo | [Unsplash](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80) | 53K |

## 📊 Otras Categorías (Ya existentes)

### Inspirations
- `story-1.webp` a `story-6.webp` (6 imágenes)

### News
- `news-1.webp` a `news-5.webp` (5 imágenes)

### EU
- `map-hero.webp`

### Locations
- `madrid.webp`
- `barcelona.webp`
- `paris.webp`
- `berlin.webp`
- `rome.webp`

### Webinars
- `hero-bg.webp`
- `upcoming-1.webp`
- `upcoming-2.webp`
- `past-1.webp`
- `past-2.webp`

### Trace
- `hero-bg.svg`

## 🔧 Scripts de Utilidad

### `download-images.js`

Script de Node.js para descargar todas las imágenes desde Unsplash.

**Uso:**
```bash
node download-images.js
```

**Características:**
- Descarga automática desde Unsplash
- Crea directorios si no existen
- Evita descargar imágenes duplicadas
- Muestra progreso y resumen

## 📝 Notas

1. **Formato:** Todas las imágenes están en formato WebP para optimizar el rendimiento
2. **Licencia:** Imágenes de Unsplash bajo licencia gratuita
3. **Optimización:** Las imágenes ya están optimizadas con parámetros de calidad de Unsplash
4. **Total descargado:** 13 imágenes nuevas (~1.5 MB total)

## ✅ Estado

- ✅ Todas las carpetas creadas
- ✅ Todas las imágenes descargadas
- ✅ Placeholders `.txt` eliminados
- ✅ Carpetas `promises/` y `services/` creadas
- ⏳ Pendiente: Actualizar código para usar rutas locales (opcional)
