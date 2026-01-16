# 🚀 Guía Rápida: Generar Datos de Prueba

## ⚡ Ejecución Rápida (3 pasos)

### 1️⃣ Configura tu archivo `.env`

```bash
cd foundry
cp .env.example .env
```

Edita `.env` y agrega la **private key** de tu **Centro de Donación APROBADO**:

```env
PRIVATE_KEY=0xTU_PRIVATE_KEY_DEL_CENTRO_DE_DONACION
TRIAS_RPC_URL=https://rpc-testnet.trias.one
```

### 2️⃣ Ejecuta el script

```bash
make seed-data-tsc
```

### 3️⃣ Espera y verifica

El script creará:
- ✅ **50 donantes** ficticios
- ✅ **~125 donaciones** (2-3 por donante)
- ✅ Todas visibles en tu dashboard

---

## 📋 Requisitos Previos

✔️ Tener una cuenta registrada como **Centro de Donación**
✔️ Que esa cuenta esté **APROBADA** por los administradores
✔️ Tener fondos (TAS) para pagar las fees de las donaciones

---

## 🔧 Personalización

### Cambiar número de donantes

Edita `script/SeedData.s.sol`:

```solidity
uint256 constant NUM_DONORS = 100; // Cambia de 50 a 100
```

### Cambiar donaciones por donante

```solidity
uint256 constant MIN_DONATIONS_PER_DONOR = 3;  // Mínimo 3
uint256 constant MAX_DONATIONS_PER_DONOR = 5;  // Máximo 5
```

---

## ❌ Solución de Errores

### "Cuenta no autorizada"
→ Tu cuenta NO es Centro de Donación o NO está aprobada

### "Insufficient payment"
→ No tienes fondos suficientes en la wallet

### "Only donation centers can donate"
→ Tu cuenta no tiene el rol correcto

---

## 📊 Verificación

Después de ejecutar:

1. **Centro de Donación**: Ve a tu dashboard → Deberías ver ~125 donaciones
2. **Trazabilidad**: Busca cualquier tokenID → Verás el historial completo
3. **Donantes**: Usa una dirección de donante → Verás 2-3 donaciones

---

## 💡 Consejos

- 🕐 El proceso puede tomar **5-10 minutos** en testnet
- 💰 Costo aproximado: **125 transacciones × gas fee**
- 🔄 Puedes ejecutar el script múltiples veces para más datos
- ⚠️ **NO ejecutar en producción**

---

## 🆘 ¿Necesitas Ayuda?

1. Verifica que tu cuenta esté aprobada en `/admin/approval-requests`
2. Revisa los logs con `-vvvv` para ver errores detallados
3. Asegúrate de tener fondos suficientes en la wallet

