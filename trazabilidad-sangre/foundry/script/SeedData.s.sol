// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {BloodTracker} from "../src/BloodTracker.sol";

/**
 * @title SeedData
 * @notice Script para generar datos de prueba con múltiples donantes y donaciones
 * @dev Crea donantes ficticios con 2-3 donaciones cada uno
 *
 * IMPORTANTE: Ejecutar con la cuenta del Centro de Donación que esté registrada y aprobada
 */
contract SeedData is Script {
    // CONFIGURACIÓN - ACTUALIZA ESTAS DIRECCIONES ANTES DE EJECUTAR
    address constant BLOOD_TRACKER_ADDRESS = 0x59b670e9fA9D0A427751Af201D676719a970857b;

    BloodTracker public tracker;
    uint256 public minimumFee;

    // Configuración de generación
    uint256 constant NUM_DONORS = 50; // Número de donantes a crear
    uint256 constant MIN_DONATIONS_PER_DONOR = 2;
    uint256 constant MAX_DONATIONS_PER_DONOR = 3;

    function run() external {
        // Obtener la private key del broadcaster (debe ser un centro de donación aprobado)
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address donationCenter = vm.addr(deployerPrivateKey);

        // Cargar contrato BloodTracker
        tracker = BloodTracker(payable(BLOOD_TRACKER_ADDRESS));
        minimumFee = tracker.getMinimumDonationFee();

        console.log("============================================");
        console.log("=== GENERACION DE DATOS DE PRUEBA ===");
        console.log("============================================");
        console.log("BloodTracker:");
        console.log(address(tracker));
        console.log("Centro de Donacion:");
        console.log(donationCenter);
        console.log("Fee minimo por donacion:");
        console.log(minimumFee);
        console.log("Numero de donantes:");
        console.log(NUM_DONORS);
        console.log("");

        // Verificar que quien ejecuta es un centro de donación
        (string memory name, string memory location, BloodTracker.Role role, , ) = tracker.companies(donationCenter);

        if (role != BloodTracker.Role.DONATION_CENTER) {
            console.log("ERROR: La cuenta que ejecuta NO es un Centro de Donacion");
            console.log("Rol actual:");
            console.log(uint8(role));
            console.log("Se requiere: Role.DONATION_CENTER (1)");
            revert("Cuenta no autorizada");
        }

        console.log("Centro de Donacion verificado:");
        console.log("  Nombre:");
        console.log(name);
        console.log("  Ubicacion:");
        console.log(location);
        console.log("");

        // Generar donaciones
        uint256 totalDonations = generateDonations(deployerPrivateKey);

        console.log("============================================");
        console.log("=== RESUMEN FINAL ===");
        console.log("============================================");
        console.log("Total de donaciones creadas:");
        console.log(totalDonations);
        console.log("Donantes creados:");
        console.log(NUM_DONORS);
        console.log("Promedio de donaciones por donante:");
        console.log(totalDonations / NUM_DONORS);
        console.log("Costo total en fees:");
        console.log(minimumFee * totalDonations);
        console.log("============================================");
    }

    function generateDonations(uint256 centerPrivateKey) internal returns (uint256) {
        uint256 totalDonations = 0;
        uint256 successfulDonations = 0;
        uint256 failedDonations = 0;

        console.log("Iniciando creacion de donaciones...");
        console.log("");

        // Para cada donante
        for (uint256 i = 0; i < NUM_DONORS; i++) {
            // Generar dirección única del donante
            address donorAddress = address(uint160(uint256(keccak256(abi.encodePacked("donor", i, block.timestamp)))));

            // Determinar cuántas donaciones hará este donante (alterna entre 2 y 3)
            uint256 numDonations = MIN_DONATIONS_PER_DONOR + (i % 2);

            console.log("----------------------------------------");
            console.log("Donante #:");
            console.log(i + 1);
            console.log("  Direccion:");
            console.log(donorAddress);
            console.log("  Donaciones a realizar:");
            console.log(numDonations);

            // Crear donaciones para este donante
            for (uint256 j = 0; j < numDonations; j++) {
                vm.startBroadcast(centerPrivateKey);

                try tracker.donate{value: minimumFee}(donorAddress) {
                    successfulDonations++;
                    totalDonations++;
                    console.log("    Donacion OK - Total:");
                    console.log(totalDonations);
                } catch Error(string memory reason) {
                    failedDonations++;
                    console.log("    Donacion ERROR:");
                    console.log(reason);
                } catch (bytes memory) {
                    failedDonations++;
                    console.log("    Donacion ERROR desconocido");
                }

                vm.stopBroadcast();
            }
        }

        console.log("");
        console.log("Donaciones exitosas:");
        console.log(successfulDonations);
        console.log("Donaciones fallidas:");
        console.log(failedDonations);
        console.log("");

        return totalDonations;
    }
}
