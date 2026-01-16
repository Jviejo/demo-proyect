// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {BloodTracker} from "../src/BloodTracker.sol";
import {BloodDonation} from "../src/BloodDonation.sol";
import {BloodDerivative} from "../src/BloodDerivative.sol";

/**
 * @title SeedDataComplete
 * @notice Script completo para poblar el sistema de trazabilidad con datos de prueba
 * @dev Ejecuta el flujo completo: funding, registro, donaciones, derivados y marketplace
 *
 * IMPORTANTE: Antes de ejecutar este script:
 * 1. Generar wallets con: cd foundry && make generate-wallets
 * 2. Copiar manualmente las addresses y privateKeys desde .clientWallets a initializeWallets()
 * 3. Verificar que las addresses de los contratos son correctas
 *
 * Ejecución:
 * - Anvil: make seed-complete-anvil
 * - Besu: make seed-complete-besu
 */
contract SeedDataComplete is Script {
    // ============ CONFIGURACIÓN DE RED ============

    // Direcciones de contratos desplegados en Besu CodeCrypto
    address constant BLOOD_TRACKER_ADDRESS = 0xAD02838C74214EE9FD253b678c489a7885527f1C;
    address constant BLOOD_DONATION_ADDRESS = 0x02f2Ad3c32374c98DD52747a8cf825907CbDe794;
    address constant BLOOD_DERIVATIVE_ADDRESS = 0x8Cdd7b2Fa65D5c5EbadCf660821d4150559c42bb;

    // Admin de Besu CodeCrypto
    address constant ADMIN_ADDRESS = 0x60015448D7418C4e70275a5aA2340086A9f8Dd01;
    uint256 constant ADMIN_PK = 0x3f5d84191f172800677da32d4897e048404cfeb23c2c360edaa4341464d43b1c;

    // ============ CONFIGURACIÓN DEL SEED ============

    uint256 constant FUNDING_AMOUNT = 900 ether; // ETH para cada wallet (9000 total)
    uint256 constant NUM_DONATION_CENTERS = 3;
    uint256 constant DONATIONS_PER_CENTER = 50; // Total: 150 donaciones
    uint256 constant DONATIONS_TO_PROCESS = 20; // Bolsas a procesar en derivados

    // ============ VARIABLES DE ESTADO ============

    BloodTracker tracker;
    BloodDonation donation;
    BloodDerivative derivative;
    uint256 minimumFee;

    // Struct para almacenar información de wallets
    struct WalletInfo {
        address addr;
        uint256 pk;
        string name;
        string location;
        BloodTracker.Role role;
    }

    WalletInfo[] wallets;
    uint256[] donationTokenIds; // Para rastrear IDs de donaciones creadas

    // ============ FUNCIÓN PRINCIPAL ============

    function run() external {
        console.log("========================================");
        console.log("SEED DATA COMPLETO: Sistema Trazabilidad Sangre");
        console.log("========================================\n");

        // 1. Setup inicial
        setupContracts();
        initializeWallets();

        // 2. Verificar balance del admin
        uint256 adminBalance = ADMIN_ADDRESS.balance;
        console.log("Balance Admin:", adminBalance / 1 ether, "ETH");
        require(adminBalance >= FUNDING_AMOUNT * wallets.length, "Admin no tiene suficiente ETH");

        // 3. Ejecutar flujo completo
        fundAllWallets();
        registerAndApproveAll();
        createAllDonations();
        processDerivativesSample();
        setupMarketplace();
        finalActions();

        // 4. Mostrar resumen
        printSummary();
    }

    // ============ SETUP ============

    function setupContracts() internal {
        console.log("1. Conectando a contratos desplegados...");

        tracker = BloodTracker(payable(BLOOD_TRACKER_ADDRESS));
        donation = BloodDonation(BLOOD_DONATION_ADDRESS);
        derivative = BloodDerivative(BLOOD_DERIVATIVE_ADDRESS);

        minimumFee = 0.001 ether; // MINIMUM_DONATION_FEE hardcoded

        console.log("   BloodTracker:", address(tracker));
        console.log("   BloodDonation:", address(donation));
        console.log("   BloodDerivative:", address(derivative));
        console.log("   Minimum Fee:", minimumFee);
        console.log("");
    }

    function initializeWallets() internal {
        console.log("2. Inicializando wallets...");
        console.log("   IMPORTANTE: Copiar addresses y PKs desde .clientWallets\n");

        // ===== DONATION CENTERS (3) =====
        wallets.push(WalletInfo({
            addr: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,
            pk: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
            name: "Centro Donacion Madrid",
            location: "Madrid, Espana",
            role: BloodTracker.Role.DONATION_CENTER
        }));

        wallets.push(WalletInfo({
            addr: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
            pk: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d,
            name: "Centro Donacion Barcelona",
            location: "Barcelona, Espana",
            role: BloodTracker.Role.DONATION_CENTER
        }));

        wallets.push(WalletInfo({
            addr: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,
            pk: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a,
            name: "Centro Donacion Valencia",
            location: "Valencia, Espana",
            role: BloodTracker.Role.DONATION_CENTER
        }));

        // ===== LABORATORIES (2) =====
        wallets.push(WalletInfo({
            addr: 0x90F79bf6EB2c4f870365E785982E1f101E93b906,
            pk: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6,
            name: "Laboratorio Central",
            location: "Madrid, Espana",
            role: BloodTracker.Role.LABORATORY
        }));

        wallets.push(WalletInfo({
            addr: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65,
            pk: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a,
            name: "Laboratorio Regional Norte",
            location: "Bilbao, Espana",
            role: BloodTracker.Role.LABORATORY
        }));

        // ===== TRADERS (2) =====
        wallets.push(WalletInfo({
            addr: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc,
            pk: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba,
            name: "Trader Alpha Bio",
            location: "Barcelona, Espana",
            role: BloodTracker.Role.TRADER
        }));

        wallets.push(WalletInfo({
            addr: 0x976EA74026E726554dB657fA54763abd0C3a0aa9,
            pk: 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e,
            name: "Trader Beta Med",
            location: "Valencia, Espana",
            role: BloodTracker.Role.TRADER
        }));

        // ===== HOSPITALS (2) =====
        wallets.push(WalletInfo({
            addr: 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955,
            pk: 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356,
            name: "Hospital General Universitario",
            location: "Madrid, Espana",
            role: BloodTracker.Role.HOSPITAL
        }));

        wallets.push(WalletInfo({
            addr: 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f,
            pk: 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97,
            name: "Hospital Clinico Provincial",
            location: "Barcelona, Espana",
            role: BloodTracker.Role.HOSPITAL
        }));

        // ===== MANUFACTURER (1) =====
        wallets.push(WalletInfo({
            addr: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720,
            pk: 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6,
            name: "Cosmetics Plasma Corp",
            location: "Valencia, Espana",
            role: BloodTracker.Role.MANUFACTURER
        }));

        console.log("   Total wallets inicializadas:", wallets.length);
        console.log("");
    }

    // ============ FUNDING ============

    function fundAllWallets() internal {
        console.log("3. Transfiriendo fondos a wallets...");
        console.log("   Cantidad por wallet:", FUNDING_AMOUNT / 1 ether, "ETH\n");

        for (uint256 i = 0; i < wallets.length; i++) {
            WalletInfo memory w = wallets[i];

            vm.startBroadcast(ADMIN_PK);
            (bool success, ) = w.addr.call{value: FUNDING_AMOUNT}("");
            require(success, "Transfer failed");
            vm.stopBroadcast();

            console.log("   Funded:", w.name);
            console.log("      Address:", w.addr);
            console.log("      Balance:", w.addr.balance / 1 ether, "ETH");
        }
        console.log("");
    }

    // ============ REGISTRO ============

    function registerAndApproveAll() internal {
        console.log("4. Registrando y aprobando wallets...\n");

        for (uint256 i = 0; i < wallets.length; i++) {
            WalletInfo memory w = wallets[i];

            // Paso 1: Solicitar registro
            vm.startBroadcast(w.pk);
            tracker.requestSignUp(w.name, w.location, w.role);
            vm.stopBroadcast();

            // Paso 2: Obtener requestId desde el mapping activeRequestId
            uint256 requestId = tracker.activeRequestId(w.addr);
            require(requestId > 0, "Request ID not found");

            // Paso 3: Aprobar como admin
            vm.startBroadcast(ADMIN_PK);
            tracker.approveRequest(requestId);
            vm.stopBroadcast();

            console.log("   Registrado:", w.name);
            console.log("      Role:", uint256(w.role));
            console.log("      RequestId:", requestId);
        }
        console.log("");
    }

    // ============ DONACIONES ============

    function createAllDonations() internal {
        console.log("5. Creando donaciones...");
        console.log("   Total a crear:", DONATIONS_PER_CENTER * NUM_DONATION_CENTERS);
        console.log("   Por centro:", DONATIONS_PER_CENTER, "\n");

        uint256 donationCount = 0;

        // Iterar sobre los 3 centros de donación (índices 0, 1, 2)
        for (uint256 centerIdx = 0; centerIdx < NUM_DONATION_CENTERS; centerIdx++) {
            WalletInfo memory center = wallets[centerIdx];
            console.log("   Centro:", center.name);

            for (uint256 donorIdx = 0; donorIdx < DONATIONS_PER_CENTER; donorIdx++) {
                // Generar dirección única de donante (no necesita PK)
                address donorAddress = address(uint160(uint256(keccak256(abi.encodePacked("donor", centerIdx, donorIdx)))));

                // Crear donación
                vm.startBroadcast(center.pk);
                tracker.donate{value: minimumFee}(donorAddress);
                vm.stopBroadcast();

                donationCount++;

                // Guardar tokenId (asumimos que los tokens se crean secuencialmente desde 1)
                donationTokenIds.push(donationCount);

                // Log cada 10 donaciones
                if (donationCount % 10 == 0) {
                    console.log("      Donaciones creadas:", donationCount);
                }
            }
        }

        console.log("   Total creadas:", donationCount);
        console.log("");
    }

    // ============ PROCESAMIENTO DE DERIVADOS ============

    function processDerivativesSample() internal {
        console.log("6. Procesando derivados...");
        console.log("   Donaciones a procesar:", DONATIONS_TO_PROCESS, "\n");

        // Transferir y procesar las primeras DONATIONS_TO_PROCESS bolsas
        // Dividir entre los 2 laboratorios
        uint256 lab1Idx = 3; // Laboratorio Central
        uint256 lab2Idx = 4; // Laboratorio Regional Norte

        for (uint256 i = 0; i < DONATIONS_TO_PROCESS; i++) {
            uint256 tokenId = donationTokenIds[i];

            // Alternar entre laboratorios
            uint256 labIdx = (i % 2 == 0) ? lab1Idx : lab2Idx;
            WalletInfo memory lab = wallets[labIdx];

            // Obtener el centro que creó la donación (owner actual)
            address currentOwner = donation.ownerOf(tokenId);

            // Transferir del centro al laboratorio
            vm.startBroadcast(getCenterPK(currentOwner));
            donation.transferFrom(currentOwner, lab.addr, tokenId);
            vm.stopBroadcast();

            // Procesar en derivados
            vm.startBroadcast(lab.pk);
            tracker.process(tokenId);
            vm.stopBroadcast();

            if ((i + 1) % 5 == 0) {
                console.log("      Procesadas:", i + 1);
            }
        }

        console.log("   Total procesadas:", DONATIONS_TO_PROCESS);
        console.log("   Derivados generados:", DONATIONS_TO_PROCESS * 3);
        console.log("");
    }

    // Helper para obtener PK del centro dueño de una donación
    function getCenterPK(address centerAddr) internal view returns (uint256) {
        for (uint256 i = 0; i < NUM_DONATION_CENTERS; i++) {
            if (wallets[i].addr == centerAddr) {
                return wallets[i].pk;
            }
        }
        revert("Center not found");
    }

    // ============ MARKETPLACE ============

    function setupMarketplace() internal {
        console.log("7. Configurando marketplace...\n");

        uint256 lab1Idx = 3; // Laboratorio Central
        uint256 trader1Idx = 5; // Trader Alpha Bio
        uint256 hospital1Idx = 7; // Hospital General

        WalletInfo memory lab1 = wallets[lab1Idx];
        WalletInfo memory trader1 = wallets[trader1Idx];
        WalletInfo memory hospital1 = wallets[hospital1Idx];

        // Los derivados procesados tienen IDs desde 1 hasta DONATIONS_TO_PROCESS * 3
        // Vamos a listar algunos derivados del laboratorio

        console.log("   Listando derivados del laboratorio...");

        // Listar 5 derivados en marketplace
        for (uint256 i = 1; i <= 5; i++) {
            // Verificar si el lab1 es dueño del derivado
            try derivative.ownerOf(i) returns (address owner) {
                if (owner == lab1.addr) {
                    vm.startBroadcast(lab1.pk);
                    // Primero aprobar el NFT para el marketplace
                    derivative.approve(address(tracker), i);
                    // Luego listarlo
                    tracker.listItem(
                        address(derivative),
                        i,
                        0.1 ether
                    );
                    vm.stopBroadcast();
                    console.log("      Listado derivado #", i);
                }
            } catch {
                // El token no existe o no pertenece al lab
            }
        }

        // Trader compra un derivado (necesita address del contrato y tokenId)
        console.log("   Trader comprando derivado...");
        vm.startBroadcast(trader1.pk);
        tracker.buyItem{value: 0.1 ether}(address(derivative), 1); // Comprar derivado #1
        vm.stopBroadcast();
        console.log("      Trader compro derivado #1");

        // Centro transfiere una bolsa sin procesar directamente a un hospital
        console.log("   Centro transfiriendo bolsa a hospital...");

        uint256 center1Idx = 0; // Centro Madrid
        WalletInfo memory center1 = wallets[center1Idx];
        uint256 bagTokenId = donationTokenIds[DONATIONS_TO_PROCESS]; // Primera bolsa no procesada

        vm.startBroadcast(center1.pk);
        donation.transferFrom(center1.addr, hospital1.addr, bagTokenId);
        vm.stopBroadcast();
        console.log("      Centro transfirio bolsa #", bagTokenId, "a hospital");

        console.log("");
    }

    // ============ ACCIONES FINALES ============

    function finalActions() internal {
        console.log("8. Ejecutando acciones finales...\n");

        uint256 hospital1Idx = 7; // Hospital General
        uint256 manufacturerIdx = 9; // Cosmetics Corp

        WalletInfo memory hospital1 = wallets[hospital1Idx];
        WalletInfo memory manufacturer = wallets[manufacturerIdx];

        // Hospital administra producto a paciente
        console.log("   Hospital administrando a paciente...");

        // Necesitamos un tokenId que el hospital posea
        // Después de comprar en marketplace, el hospital tiene la bolsa
        uint256 bagForPatient = donationTokenIds[DONATIONS_TO_PROCESS];

        vm.startBroadcast(hospital1.pk);
        tracker.registerPatientAdministration(
            bagForPatient,
            true, // isBloodBag = true (es una bolsa completa)
            "PATIENT-HASH-12345",
            "Cirugia de emergencia"
        );
        vm.stopBroadcast();
        console.log("      Administracion registrada para paciente");

        // Manufacturer crea lote de producto
        console.log("   Manufacturer creando lote...");

        // Necesita derivados de Plasma. Los IDs impares suelen ser Plasma (1, 4, 7, ...)
        // Primero necesitamos transferir algunos derivados al manufacturer
        // Para simplificar, asumimos que el trader ya vendió algunos al manufacturer

        // Transferir derivado del trader al manufacturer
        uint256 trader1Idx = 5;
        WalletInfo memory trader1 = wallets[trader1Idx];

        // El trader compró el derivado #1 en marketplace
        vm.startBroadcast(trader1.pk);
        derivative.transferFrom(trader1.addr, manufacturer.addr, 1);
        vm.stopBroadcast();

        // Manufacturer crea batch con el derivado recibido
        uint256[] memory derivativeIds = new uint256[](1);
        derivativeIds[0] = 1;

        vm.startBroadcast(manufacturer.pk);
        tracker.createManufacturedBatch(
            derivativeIds,
            "Plasma Facial Cream Premium"
        );
        vm.stopBroadcast();
        console.log("      Lote manufacturado creado");

        console.log("");
    }

    // ============ RESUMEN ============

    function printSummary() internal view {
        console.log("========================================");
        console.log("RESUMEN FINAL");
        console.log("========================================\n");

        console.log("Wallets registradas:", wallets.length);
        console.log("Donaciones creadas:", donationTokenIds.length);
        console.log("Donaciones procesadas:", DONATIONS_TO_PROCESS);
        console.log("Derivados generados:", DONATIONS_TO_PROCESS * 3);
        console.log("");

        console.log("Contratos:");
        console.log("  BloodTracker:", address(tracker));
        console.log("  BloodDonation:", address(donation));
        console.log("  BloodDerivative:", address(derivative));
        console.log("");

        console.log("Estado Final:");
        try donation.totalSupply() returns (uint256 total) {
            console.log("  Total BloodDonation NFTs:", total);
        } catch {}

        try derivative.totalSupply() returns (uint256 total) {
            console.log("  Total BloodDerivative NFTs:", total);
        } catch {}

        console.log("");
        console.log("Seed completado exitosamente!");
        console.log("========================================");
    }
}
