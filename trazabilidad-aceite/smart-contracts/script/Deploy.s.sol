// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {Usuarios} from "../src/Usuarios.sol";
import {Tokens} from "../src/Tokens.sol";
import {OliveOilCertification} from "../src/Certificate.sol";

contract Deploy is Script {
    Usuarios public usuarios;
    Tokens public tokens;
    OliveOilCertification public certification;

    function run() public {
        vm.startBroadcast();

        // 1. Deploy Usuarios contract
        usuarios = new Usuarios();
        console2.log("Usuarios deployed at:", address(usuarios));

        // Register default users (using Anvil default accounts)
        // Account 2: Productor
        usuarios.nuevoUsuario(
            0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
            "Productor 1",
            "37.8847,-4.7792", // Coordenadas de ejemplo en Córdoba
            "productor"
        );

        // Account 3: Fabrica
        usuarios.nuevoUsuario(
            0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,
            "Fabrica 1",
            "42.043863584358185, 3.1300091754146946",
            "fabrica"
        );

        // Account 4: Minorista
        usuarios.nuevoUsuario(
            0x90F79bf6EB2c4f870365E785982E1f101E93b906,
            "Minorista 1",
            "42.91175372414766, -3.3297968667543394",
            "minorista"
        );

        // 2. Deploy Tokens contract
        tokens = new Tokens(address(usuarios));
        console2.log("Tokens deployed at:", address(tokens));

        // 3. Deploy OliveOilCertification contract
        certification = new OliveOilCertification(address(tokens));
        console2.log("OliveOilCertification deployed at:", address(certification));

        console2.log("\n=== Deployment Summary ===");
        console2.log("Usuarios:", address(usuarios));
        console2.log("Tokens:", address(tokens));
        console2.log("OliveOilCertification:", address(certification));

        vm.stopBroadcast();
    }
}
