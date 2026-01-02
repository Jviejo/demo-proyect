// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {RawMineral} from "../src/jewel-chain/RawMineral.sol";

contract DeployRawMineral is Script {
    function run() external {
        vm.startBroadcast();

        address userAddressSC = 0x31BFc5d6C8FfA2F83e0d7f125C49047de3f76fb6;
        new RawMineral(userAddressSC);

        vm.stopBroadcast();
    }
}
