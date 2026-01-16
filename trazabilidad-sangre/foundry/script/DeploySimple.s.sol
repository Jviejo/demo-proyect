// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {BloodTracker} from "../src/BloodTracker.sol";
import {BloodDonation} from "../src/BloodDonation.sol";
import {BloodDerivative} from "../src/BloodDerivative.sol";

contract DeploySimple is Script {
    function run() external returns (BloodTracker, BloodDonation, BloodDerivative) {
        address initialAdmin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

        console.log("Deploying with initial admin:", initialAdmin);

        vm.startBroadcast();

        BloodDonation bld = new BloodDonation();
        console.log("BloodDonation deployed at:", address(bld));

        BloodDerivative der = new BloodDerivative();
        console.log("BloodDerivative deployed at:", address(der));

        BloodTracker bldTracker = new BloodTracker(
            address(bld),
            address(der),
            initialAdmin
        );
        console.log("BloodTracker deployed at:", address(bldTracker));

        bld.transferOwnership(address(bldTracker));
        der.transferOwnership(address(bldTracker));

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("BloodTracker:", address(bldTracker));
        console.log("BloodDonation:", address(bld));
        console.log("BloodDerivative:", address(der));
        console.log("Initial Admin:", initialAdmin);

        return (bldTracker, bld, der);
    }
}
