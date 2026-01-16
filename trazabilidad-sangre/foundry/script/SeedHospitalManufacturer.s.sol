// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {BloodTracker} from "../src/BloodTracker.sol";
import {BloodDonation} from "../src/BloodDonation.sol";
import {BloodDerivative} from "../src/BloodDerivative.sol";

/**
 * @title SeedHospitalManufacturer
 * @notice Script para crear un entorno completo de testing con Hospital y Manufacturer
 * @dev Crea empresas, donaciones, derivados, listings y compras para testing manual
 *
 * ESCENARIO COMPLETO:
 * 1. Registrar Hospital y Manufacturer
 * 2. Aprobar sus solicitudes (como admin)
 * 3. Crear donaciones (como centro de donación)
 * 4. Procesar derivados (como laboratorio)
 * 5. Listar items en marketplace (laboratorio lista bolsas + derivados)
 * 6. Hospital compra 1 bolsa y 2 derivados
 * 7. Manufacturer compra 3 derivados
 * 8. Hospital administra a paciente
 * 9. Manufacturer crea lote de producto
 *
 * REQUISITOS PREVIOS:
 * - Contrato BloodTracker desplegado
 * - Centro de Donación registrado y aprobado
 * - Laboratorio registrado y aprobado
 * - Cuenta admin configurada (ADMIN_PRIVATE_KEY)
 */
contract SeedHospitalManufacturer is Script {
    // CONFIGURACIÓN - ACTUALIZA ESTAS DIRECCIONES ANTES DE EJECUTAR
    address constant BLOOD_TRACKER_ADDRESS = 0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB;
    address constant BLOOD_DONATION_ADDRESS = 0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E;
    address constant BLOOD_DERIVATIVE_ADDRESS = 0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690;

    // Contratos
    BloodTracker public tracker;
    BloodDonation public donation;
    BloodDerivative public derivative;

    // Configuración de cuentas (usar cuentas de Anvil)
    address constant ADMIN_ADDRESS = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // Cuenta 0 de Anvil
    address constant DONATION_CENTER_ADDRESS = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Cuenta 1
    address constant LABORATORY_ADDRESS = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // Cuenta 2
    address constant HOSPITAL_ADDRESS = 0x90F79bf6EB2c4f870365E785982E1f101E93b906; // Cuenta 3
    address constant MANUFACTURER_ADDRESS = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65; // Cuenta 4

    // Private keys correspondientes (cuentas de Anvil por defecto)
    uint256 constant ADMIN_PK = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    uint256 constant DONATION_CENTER_PK = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;
    uint256 constant LABORATORY_PK = 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a;
    uint256 constant HOSPITAL_PK = 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6;
    uint256 constant MANUFACTURER_PK = 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a;

    // Configuración de generación
    uint256 constant NUM_DONATIONS = 5; // Donaciones a crear
    uint256 constant NUM_DERIVATIVES_TO_PROCESS = 3; // Bolsas a procesar en derivados
    uint256 minimumFee;

    // Contadores para tracking
    uint256[] createdDonationIds;
    uint256[] createdDerivativeIds;

    function run() external {
        // Cargar contratos
        tracker = BloodTracker(payable(BLOOD_TRACKER_ADDRESS));
        donation = BloodDonation(BLOOD_DONATION_ADDRESS);
        derivative = BloodDerivative(BLOOD_DERIVATIVE_ADDRESS);
        minimumFee = tracker.getMinimumDonationFee();

        console.log("============================================");
        console.log("=== SEED DATA: Hospital & Manufacturer ===");
        console.log("============================================");
        console.log("BloodTracker:", BLOOD_TRACKER_ADDRESS);
        console.log("BloodDonation:", BLOOD_DONATION_ADDRESS);
        console.log("BloodDerivative:", BLOOD_DERIVATIVE_ADDRESS);
        console.log("");

        // Paso 1: Registrar Hospital y Manufacturer
        console.log(">>> PASO 1: Registrar Hospital y Manufacturer");
        registerHospitalAndManufacturer();
        console.log("");

        // Paso 2: Aprobar solicitudes (como admin)
        console.log(">>> PASO 2: Aprobar solicitudes");
        approveRegistrations();
        console.log("");

        // Paso 3: Crear donaciones (como centro de donación)
        console.log(">>> PASO 3: Crear donaciones");
        createDonations();
        console.log("");

        // Paso 4: Procesar algunas donaciones en derivados (como laboratorio)
        console.log(">>> PASO 4: Procesar derivados");
        processDerivatives();
        console.log("");

        // Paso 5: Listar items en marketplace (laboratorio)
        console.log(">>> PASO 5: Listar items en marketplace");
        listItemsInMarketplace();
        console.log("");

        // Paso 6: Hospital compra items
        console.log(">>> PASO 6: Hospital compra items");
        hospitalBuysItems();
        console.log("");

        // Paso 7: Manufacturer compra derivados
        console.log(">>> PASO 7: Manufacturer compra derivados");
        manufacturerBuysItems();
        console.log("");

        // Paso 8: Hospital administra a paciente
        console.log(">>> PASO 8: Hospital administra a paciente");
        hospitalAdministersToPatient();
        console.log("");

        // Paso 9: Manufacturer crea lote
        console.log(">>> PASO 9: Manufacturer crea lote");
        manufacturerCreatesBatch();
        console.log("");

        printSummary();
    }

    function registerHospitalAndManufacturer() internal {
        // Registrar Hospital
        vm.startBroadcast(HOSPITAL_PK);
        tracker.requestSignUp("Hospital Central", "Ciudad Capital", BloodTracker.Role.HOSPITAL);
        vm.stopBroadcast();
        console.log("  Hospital registrado:", HOSPITAL_ADDRESS);

        // Registrar Manufacturer
        vm.startBroadcast(MANUFACTURER_PK);
        tracker.requestSignUp("Cosmetics Inc", "Zona Industrial", BloodTracker.Role.MANUFACTURER);
        vm.stopBroadcast();
        console.log("  Manufacturer registrado:", MANUFACTURER_ADDRESS);
    }

    function approveRegistrations() internal {
        vm.startBroadcast(ADMIN_PK);

        // Obtener IDs de solicitudes activas
        (,,,, uint256 hospitalRequestId) = tracker.companies(HOSPITAL_ADDRESS);
        (,,,, uint256 manufacturerRequestId) = tracker.companies(MANUFACTURER_ADDRESS);

        // Aprobar Hospital
        tracker.approveRequest(hospitalRequestId);
        console.log("  Hospital aprobado (Request ID:", hospitalRequestId, ")");

        // Aprobar Manufacturer
        tracker.approveRequest(manufacturerRequestId);
        console.log("  Manufacturer aprobado (Request ID:", manufacturerRequestId, ")");

        vm.stopBroadcast();
    }

    function createDonations() internal {
        // Obtener totalSupply antes de crear donaciones
        uint256 totalSupplyBefore = donation.totalSupply();
        console.log("  Total donaciones antes:", totalSupplyBefore);

        vm.startBroadcast(DONATION_CENTER_PK);

        for (uint256 i = 0; i < NUM_DONATIONS; i++) {
            // Generar dirección única del donante
            address donorAddress = address(uint160(uint256(keccak256(abi.encodePacked("donor", i, block.timestamp, DONATION_CENTER_ADDRESS)))));

            // Crear donación
            tracker.donate{value: minimumFee}(donorAddress);

            // El tokenId es totalSupplyBefore + i + 1 (los NFTs empiezan desde 1)
            uint256 newTokenId = totalSupplyBefore + i + 1;
            createdDonationIds.push(newTokenId);

            console.log("  Donacion creada #", newTokenId, "para donante:", donorAddress);
        }

        vm.stopBroadcast();
        console.log("  Total donaciones creadas:", NUM_DONATIONS);
    }

    function processDerivatives() internal {
        // Obtener totalSupply de derivados antes de procesar
        uint256 derivativeTotalSupplyBefore = derivative.totalSupply();
        console.log("  Total derivados antes:", derivativeTotalSupplyBefore);

        // Centro de donación transfiere bolsas al laboratorio
        vm.startBroadcast(DONATION_CENTER_PK);
        for (uint256 i = 0; i < NUM_DERIVATIVES_TO_PROCESS; i++) {
            uint256 tokenId = createdDonationIds[i];
            donation.transferFrom(DONATION_CENTER_ADDRESS, LABORATORY_ADDRESS, tokenId);
            console.log("  Bolsa #", tokenId, "transferida a laboratorio");
        }
        vm.stopBroadcast();

        // Ahora el laboratorio procesa las bolsas en derivados
        vm.startBroadcast(LABORATORY_PK);
        for (uint256 i = 0; i < NUM_DERIVATIVES_TO_PROCESS; i++) {
            uint256 tokenId = createdDonationIds[i];

            // Aprobar al tracker para quemar el NFT
            donation.approve(BLOOD_TRACKER_ADDRESS, tokenId);

            // Procesar derivados (retorna 3 IDs: plasma, erythrocytes, platelets)
            (uint256 plasmaId, uint256 erythrocytesId, uint256 plateletsId) = tracker.process(tokenId);

            console.log("  Bolsa procesada #", tokenId);
            console.log("    Derivados: Plasma", plasmaId);
            console.log("               Eritrocitos", erythrocytesId);
            console.log("               Plaquetas", plateletsId);

            // Almacenar los IDs de derivados generados
            createdDerivativeIds.push(plasmaId);
            createdDerivativeIds.push(erythrocytesId);
            createdDerivativeIds.push(plateletsId);
        }
        vm.stopBroadcast();

        console.log("  Total derivados creados:", createdDerivativeIds.length);
    }

    function listItemsInMarketplace() internal {
        vm.startBroadcast(LABORATORY_PK);

        // Listar 2 bolsas completas (las que no fueron procesadas)
        uint256 bloodBagsToList = NUM_DONATIONS - NUM_DERIVATIVES_TO_PROCESS;
        for (uint256 i = NUM_DERIVATIVES_TO_PROCESS; i < NUM_DONATIONS; i++) {
            uint256 tokenId = createdDonationIds[i];

            // Aprobar y listar
            donation.approve(BLOOD_TRACKER_ADDRESS, tokenId);
            tracker.listItem(BLOOD_DONATION_ADDRESS, tokenId, 0.1 ether);

            console.log("  Bolsa #", tokenId, "listada en marketplace (0.1 ETH)");
        }

        // Listar 6 derivados (dejar 3 para compra directa)
        uint256 derivativesToList = createdDerivativeIds.length > 6 ? 6 : createdDerivativeIds.length;
        for (uint256 i = 0; i < derivativesToList; i++) {
            uint256 tokenId = createdDerivativeIds[i];

            // Aprobar y listar
            derivative.approve(BLOOD_TRACKER_ADDRESS, tokenId);
            tracker.listItem(BLOOD_DERIVATIVE_ADDRESS, tokenId, 0.05 ether);

            console.log("  Derivado #", tokenId, "listado en marketplace (0.05 ETH)");
        }

        vm.stopBroadcast();
        console.log("  Items listados:", bloodBagsToList + derivativesToList);
    }

    function hospitalBuysItems() internal {
        vm.startBroadcast(HOSPITAL_PK);

        // Comprar 1 bolsa completa
        uint256 bloodBagId = createdDonationIds[NUM_DERIVATIVES_TO_PROCESS]; // Primera bolsa listada

        // Aprobar el token para que el tracker lo pueda transferir
        // Nota: El vendedor (laboratorio) ya aprobó, pero necesitamos que el contrato pueda mover el token
        tracker.buyItem{value: 0.1 ether}(BLOOD_DONATION_ADDRESS, bloodBagId);
        console.log("  Hospital compro bolsa #", bloodBagId);

        // Comprar 2 derivados
        if (createdDerivativeIds.length >= 2) {
            tracker.buyItem{value: 0.05 ether}(BLOOD_DERIVATIVE_ADDRESS, createdDerivativeIds[0]);
            console.log("  Hospital compro derivado #", createdDerivativeIds[0]);

            tracker.buyItem{value: 0.05 ether}(BLOOD_DERIVATIVE_ADDRESS, createdDerivativeIds[1]);
            console.log("  Hospital compro derivado #", createdDerivativeIds[1]);
        }

        vm.stopBroadcast();
        console.log("  Hospital compro 1 bolsa + 2 derivados");
    }

    function manufacturerBuysItems() internal {
        vm.startBroadcast(MANUFACTURER_PK);

        // Comprar 3 derivados (del índice 2 al 4)
        if (createdDerivativeIds.length >= 5) {
            for (uint256 i = 2; i < 5; i++) {
                tracker.buyItem{value: 0.05 ether}(BLOOD_DERIVATIVE_ADDRESS, createdDerivativeIds[i]);
                console.log("  Manufacturer compro derivado #", createdDerivativeIds[i]);
            }
        }

        vm.stopBroadcast();
        console.log("  Manufacturer compro 3 derivados");
    }

    function hospitalAdministersToPatient() internal {
        vm.startBroadcast(HOSPITAL_PK);

        // Administrar la bolsa completa a un paciente
        uint256 bloodBagId = createdDonationIds[NUM_DERIVATIVES_TO_PROCESS];

        tracker.registerPatientAdministration(
            bloodBagId,
            true, // isBloodBag = true
            "PATIENT-12345-HASH", // Hash del ID del paciente
            "Transfusion por cirugia mayor"
        );

        console.log("  Hospital administro bolsa #", bloodBagId, "a paciente");

        // Administrar un derivado a otro paciente
        if (createdDerivativeIds.length >= 1) {
            tracker.registerPatientAdministration(
                createdDerivativeIds[0],
                false, // isBloodBag = false
                "PATIENT-67890-HASH",
                "Transfusion de plasma por quemaduras"
            );
            console.log("  Hospital administro derivado #", createdDerivativeIds[0], "a paciente");
        }

        vm.stopBroadcast();
        console.log("  Hospital registro 2 administraciones a pacientes");
    }

    function manufacturerCreatesBatch() internal {
        vm.startBroadcast(MANUFACTURER_PK);

        // Crear lote con los 3 derivados comprados (índices 2, 3, 4)
        uint256[] memory derivativeIdsForBatch = new uint256[](3);
        if (createdDerivativeIds.length >= 5) {
            derivativeIdsForBatch[0] = createdDerivativeIds[2];
            derivativeIdsForBatch[1] = createdDerivativeIds[3];
            derivativeIdsForBatch[2] = createdDerivativeIds[4];

            uint256 batchId = tracker.createManufacturedBatch(
                derivativeIdsForBatch,
                "SERUM_ANTIAGING"
            );

            console.log("  Manufacturer creo lote #", batchId, "con 3 derivados");
            console.log("    Derivados usados:", derivativeIdsForBatch[0], derivativeIdsForBatch[1], derivativeIdsForBatch[2]);
        }

        vm.stopBroadcast();
        console.log("  Lote manufacturado creado exitosamente");
    }

    function printSummary() internal view {
        console.log("============================================");
        console.log("=== RESUMEN FINAL ===");
        console.log("============================================");
        console.log("Donaciones creadas:", NUM_DONATIONS);
        console.log("Derivados procesados:", createdDerivativeIds.length);
        console.log("Hospital:");
        console.log("  - Compro 1 bolsa + 2 derivados");
        console.log("  - Registro 2 administraciones a pacientes");
        console.log("Manufacturer:");
        console.log("  - Compro 3 derivados");
        console.log("  - Creo 1 lote de producto");
        console.log("");
        console.log("Estado final:");
        console.log("  - Bolsas en marketplace:", NUM_DONATIONS - NUM_DERIVATIVES_TO_PROCESS - 1);
        console.log("  - Derivados en marketplace:", createdDerivativeIds.length - 5);
        console.log("  - Derivados usados en lote:", 3);
        console.log("============================================");
    }
}
