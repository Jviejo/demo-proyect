# JewelChain Frontend

Este es el proyecto frontend de **JewelChain**, diseñado para interactuar con los contratos inteligentes desplegados en la blockchain de Polygon. Proporciona una interfaz de usuario sencilla y eficiente para realizar operaciones relacionadas con la trazabilidad de joyas.

---

## 🛠️ Instalación

Sigue estos pasos para configurar y ejecutar el proyecto:

1. **Instalar dependencias**:  
   Ejecuta el siguiente comando para instalar todas las dependencias necesarias:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:  
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   NEXT_PUBLIC_USER_CONTRACT_ADDRESS=
   NEXT_PUBLIC_RAW_MINERAL_CONTRACT_ADDRESS=
   NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ADDRESS=
   NEXT_PUBLIC_JEWEL_FACTORY_CONTRACT_ADDRESS=
   ```

   - **`NEXT_PUBLIC_USER_CONTRACT_ADDRESS`**: Dirección del contrato desplegado para gestionar usuarios y roles.
   - **`NEXT_PUBLIC_RAW_MINERAL_CONTRACT_ADDRESS`**: Dirección del contrato para la gestión de materiales en bruto.
   - **`NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ADDRESS`**: Dirección del contrato para la gestión de distribución.
   - **`NEXT_PUBLIC_JEWEL_FACTORY_CONTRACT_ADDRESS`**: Direccion contratro para la gestión jewel factory

   **Nota**: Reemplaza los valores con las direcciones públicas de los contratos desplegados.

3. **Iniciar la aplicación**:  
   Ejecuta el siguiente comando para arrancar la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación**:  
   Abre tu navegador y accede a [http://localhost:3000](http://localhost:3000).

---

## 📄 Funcionalidades

El frontend está diseñado para:
- Interactuar con los contratos inteligentes desplegados en la blockchain.
- Proporcionar una interfaz amigable para gestionar usuarios, materiales y distribución.
- Visualizar datos registrados en los contratos de manera transparente.

---

## 🚀 Despliegue

El frontend está desplegado en [**Vercel**.](https://jewelchain.vercel.app)

Sin embargo, puedes ejecutarlo localmente usando los pasos descritos anteriormente.

Si tienes alguna duda o problema, no dudes en ponerte en contacto. 🎉