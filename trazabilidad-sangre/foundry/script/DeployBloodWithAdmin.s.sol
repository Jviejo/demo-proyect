// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {BloodTracker} from "../src/BloodTracker.sol";
import {BloodDonation} from "../src/BloodDonation.sol";
import {BloodDerivative} from "../src/BloodDerivative.sol";

contract DeployBloodWithAdmin is Script {
    function run()
        external
        returns (BloodTracker, BloodDonation, BloodDerivative)
    {
        // Leer dirección del admin inicial desde variables de entorno
        address initialAdmin = vm.envAddress("INITIAL_ADMIN_ADDRESS");

        console.log("Deploying BloodTracker system with initial admin:", initialAdmin);

        vm.startBroadcast();

        // Desplegar contratos NFT
        BloodDonation bld = new BloodDonation();
        console.log("BloodDonation deployed at:", address(bld));

        BloodDerivative der = new BloodDerivative();
        console.log("BloodDerivative deployed at:", address(der));

        // Desplegar BloodTracker con admin inicial
        BloodTracker bldTracker = new BloodTracker(
            address(bld),
            address(der),
            initialAdmin
        );
        console.log("BloodTracker deployed at:", address(bldTracker));

        // Transferir ownership de los NFTs a BloodTracker
        bld.transferOwnership(address(bldTracker));
        console.log("BloodDonation ownership transferred to BloodTracker");

        der.transferOwnership(address(bldTracker));
        console.log("BloodDerivative ownership transferred to BloodTracker");

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("BloodTracker:", address(bldTracker));
        console.log("BloodDonation:", address(bld));
        console.log("BloodDerivative:", address(der));
        console.log("Initial Admin:", initialAdmin);

        return (bldTracker, bld, der);
    }
}
