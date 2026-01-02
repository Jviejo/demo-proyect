// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {UserJewelChain} from "../src/user/UserJewelChain.sol";

contract DeployUsersJewelsChain is Script {
    function run() external {
        vm.startBroadcast();

        new UserJewelChain();

        vm.stopBroadcast();
    }
}
