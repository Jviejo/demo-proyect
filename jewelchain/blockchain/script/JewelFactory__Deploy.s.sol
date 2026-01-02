// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {JewelFactory} from "../src/jewel-chain/JewelFactory.sol";

contract DeployJewelFactory is Script {
    function run() external {
        vm.startBroadcast();

        address userJewelChain = 0x31BFc5d6C8FfA2F83e0d7f125C49047de3f76fb6;
        address rawMineral = 0x399D46544Ea7E29A6854a9533d6adccEf8DD5097;
        address distributor = 0xea60FB44a2C8b7De3549F786EecFf877A226Ce62;
        string memory baseUri = "https://api.jewelchain.com/metadata/";

        new JewelFactory(userJewelChain, rawMineral, distributor, baseUri);

        vm.stopBroadcast();
    }
}
