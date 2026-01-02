// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {Distributor} from "../src/distributor/Distributor.sol";

contract DeployDistributor is Script {
    function run() external {
        vm.startBroadcast();

        address rawMineralAddress = 0x399D46544Ea7E29A6854a9533d6adccEf8DD5097;
        address userJewelChainAddress = 0x31BFc5d6C8FfA2F83e0d7f125C49047de3f76fb6;

        new Distributor(rawMineralAddress, userJewelChainAddress);

        vm.stopBroadcast();
    }
}
