// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {Test, console} from "forge-std/Test.sol";
import {RawMineral} from "./../src/jewel-chain/RawMineral.sol";
import {UserJewelChain} from "./../src/user/UserJewelChain.sol";
import {UserConstant} from "./../src/user/UserConstant.sol";
import {IJewelChain} from "./../src/jewel-chain/IJewelChain.sol";
import {Distributor} from "./../src/distributor/Distributor.sol";
import {IDistributor} from "./../src/distributor/IDistributor.sol";

contract DistributorTest is Test, UserConstant {
    RawMineral private rawMineral;
    UserJewelChain private userJewelChain;
    Distributor private sc_distributor;

    address private owner = address(0x1);
    address private rawMineralAddress = address(0x2);
    bytes32 private RAW_MINERAL_ROLE_TEST = RAW_MINERAL_ROLE;

    address private distributorAddress = address(0x3);
    bytes32 private DISTRIBUTOR_ROLE_TEST = DISTRIBUTOR_ROLE;

    address private jewelFactoryAddress = address(0x4);
    bytes32 private JEWEL_FACTORY_ROLE_TEST = JEWEL_FACTORY_ROLE;

    function setUp() public {
        // Deploy UserJewelChain
        userJewelChain = new UserJewelChain();
        userJewelChain.createUser(rawMineralAddress, RAW_MINERAL_ROLE_TEST, "rawMineral");
        userJewelChain.createUser(distributorAddress, DISTRIBUTOR_ROLE_TEST, "distributor");

        userJewelChain.createUser(jewelFactoryAddress, JEWEL_FACTORY_ROLE_TEST, "jewelFactory");

        // Deploy RawMineral
        rawMineral = new RawMineral(address(userJewelChain));

        // Deploy Distributor
        sc_distributor = new Distributor(address(rawMineral), address(userJewelChain));
    }

    function test_NewDelivery() public {
        // Establecer valores estáticos para la prueba
        bytes memory jewelChain = abi.encode("dummy data");
        uint256 date = 1234567890; // Fecha fija para asegurar consistencia
        vm.warp(date); // Establecer el block.timestamp
        vm.startPrank(rawMineralAddress); // Simular que msg.sender es rawMineralAddress

        // Crear trackingId exactamente como lo hace el contrato
        bytes32 trackingId = keccak256(abi.encodePacked(rawMineralAddress, date));

        // Crear la estructura Delivery como lo hace el contrato
        IDistributor.Delivery memory expectedDelivery = IDistributor.Delivery({
            shipper: rawMineralAddress,
            receiver: jewelFactoryAddress,
            trackingId: trackingId,
            shipperDate: date,
            deliveryDate: 0,
            jewelChain: jewelChain
        });

        // Configurar expectEmit para el evento
        vm.expectEmit(true, true, true, true);
        emit IDistributor.Distributor__Shipment(
            trackingId, rawMineralAddress, jewelFactoryAddress, date, expectedDelivery
        );

        // Llamar a la función del contrato
        sc_distributor.newShipment(rawMineralAddress, jewelFactoryAddress, jewelChain);

        vm.stopPrank(); // Finalizar la simulación del sender
    }
}
