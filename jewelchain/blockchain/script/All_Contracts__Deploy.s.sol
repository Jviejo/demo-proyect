// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {UserJewelChain} from "../src/user/UserJewelChain.sol";
import {RawMineral} from "../src/jewel-chain/RawMineral.sol";
import {Distributor} from "../src/distributor/Distributor.sol";
import {JewelFactory} from "../src/jewel-chain/JewelFactory.sol";
import "forge-std/console.sol";

contract DeployAllContracts is Script {
    function run() external {
        vm.startBroadcast();

        // desplegamos USER
        UserJewelChain userJewelChain = new UserJewelChain();
        address userJewelChainAddress = address(userJewelChain);

        // desplegamos RAW_MINERAL
        RawMineral rawMineral = new RawMineral(userJewelChainAddress);
        address rawMineralAddress = address(rawMineral);

        // desplegamos DISTRIBUTOR
        Distributor distributor = new Distributor(rawMineralAddress, userJewelChainAddress);
        address distributorAddress = address(distributor);

        // desplegamos JEWEL_FACTORY
        JewelFactory jewelFactory = new JewelFactory(
            userJewelChainAddress, rawMineralAddress, distributorAddress, "https://api.jewelchain.com/metadata/"
        );

        // Configurar las referencias cruzadas
        rawMineral.setDistributorSC(distributorAddress);
        distributor.setJewelFactoryAddress(address(jewelFactory));

        vm.stopBroadcast();

        console.log("Copia y pega en el  backend/.env: ");
        console.log("USER_CONTRACT_ADDRESS=", address(userJewelChain));
        console.log("RAW_MINERAL_CONTRACT_ADDRESS=", address(rawMineral));
        console.log("DISTRIBUTOR_CONTRACT_ADDRESS=", address(distributor));
        console.log("JEWEL_FACTORY_CONTRACT_ADDRESS=", address(jewelFactory));
        console.log("--------------------------------");
        console.log("Copia y pega en el  frontend/.env: ");
        console.log("NEXT_PUBLIC_USER_CONTRACT_ADDRESS=", address(userJewelChain));
        console.log("NEXT_PUBLIC_RAW_MINERAL_CONTRACT_ADDRESS=", address(rawMineral));
        console.log("NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ADDRESS=", address(distributor));
        console.log("NEXT_PUBLIC_JEWEL_FACTORY_CONTRACT_ADDRESS=", address(jewelFactory));
    }
}
