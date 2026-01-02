// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {Test, console} from "forge-std/Test.sol";
import {RawMineral} from "./../src/jewel-chain/RawMineral.sol";
import {UserJewelChain} from "./../src/user/UserJewelChain.sol";
import {UserConstant} from "./../src/user/UserConstant.sol";
import {IJewelChain} from "./../src/jewel-chain/IJewelChain.sol";
import {Distributor} from "./../src/distributor/Distributor.sol";

contract RawMineralTest is Test, UserConstant {
    enum RecordType {
        MATERIAL,
        JEWEL
    }

    RawMineral private rawMineral;
    UserJewelChain private userJewelChain;

    address private owner = address(0x1);
    address private rawMineralAddress = address(0x2);
    bytes32 private RAW_MINERAL_ROLE_TEST = RAW_MINERAL_ROLE;
    address private jewelFactoryAddress = address(0x3);
    bytes32 private JEWEL_FACTORY_ROLE_TEST = JEWEL_FACTORY_ROLE;

    uint256 date = block.timestamp;
    uint256 quantity = 100;
    bytes data = abi.encode("Additional data");
    uint256 _nonce;

    function setUp() public {
        // Deploy UserJewelChain
        userJewelChain = new UserJewelChain();

        // deploy users
        userJewelChain.createUser(rawMineralAddress, RAW_MINERAL_ROLE_TEST, "John Doe");
        userJewelChain.createUser(jewelFactoryAddress, JEWEL_FACTORY_ROLE_TEST, "John Doe");
        userJewelChain.createUser(owner, ADMIN_ROLE, "John Doe");

        rawMineral = new RawMineral(address(userJewelChain));

        // Configurar el contrato Distributor
        Distributor distributor = new Distributor(address(rawMineral), address(userJewelChain));
        rawMineral.setDistributorSC(address(distributor));
    }

    function test_CreateJeweRecordByRawMineralUser() public {
        vm.startPrank(rawMineralAddress);
        bytes32 name = keccak256("Gold");

        vm.expectEmit(true, true, true, true); // Verifica topics y datos no indexados
        emit IJewelChain.JewelChain__Created(
            rawMineralAddress,
            keccak256(abi.encodePacked(rawMineralAddress, block.timestamp, _nonce++)),
            name,
            date,
            quantity,
            data,
            IJewelChain.RecordType.MATERIAL
        );
        rawMineral.createJewelRecord(name, date, quantity, data);

        IJewelChain.JewelRecord[] memory record = rawMineral.getJewelRecordBySupplier(rawMineralAddress);

        vm.stopPrank();
        assertEq(record[0].supplier, rawMineralAddress);
        assertEq(record[0].name, name);
        assertEq(record[0].quantity, quantity);
        assertEq(record[0].date, date);
    }

    function test_CreateMineralByUserRoleNotAllowed() public {
        vm.startPrank(jewelFactoryAddress);
        bytes32 name = keccak256("Gold");

        vm.expectRevert(abi.encodeWithSelector(IJewelChain.RawMineral__UserNotAuthorized.selector, jewelFactoryAddress));
        rawMineral.createJewelRecord(name, date, quantity, data);
        vm.stopPrank();
    }

    function test_GetRawMinenralByRoleAllowed() public {
        vm.startPrank(owner);

        vm.expectRevert(abi.encodeWithSelector(IJewelChain.RawMineral__UserNotAuthorized.selector, owner));
        rawMineral.getJewelRecordBySupplier(rawMineralAddress);

        vm.stopPrank();
    }

    function test_GetRawMineralFromUserIsNotRawMineral() public {
        vm.startPrank(rawMineralAddress);
        vm.expectRevert(abi.encodeWithSelector(IJewelChain.RawMineral__SupplierIsNotRawMineral.selector, owner));
        rawMineral.getJewelRecordBySupplier(owner);
        vm.stopPrank();
    }

    function test_SendMaterial() public {
        // Setup inicial - crear un material
        vm.startPrank(rawMineralAddress);
        bytes32 name = keccak256("Gold");
        //uint256 date = block.timestamp;
        //uint256 quantity = 100;
        //bytes memory data = abi.encode("Additional data");
        rawMineral.createJewelRecord(name, date, quantity, data);

        // Obtener el material creado
        IJewelChain.JewelRecord[] memory materials = rawMineral.getJewelRecordBySupplier(rawMineralAddress);
        bytes32 uniqueId = materials[0].uniqueId;
        vm.stopPrank();
        // JewelFactory ordena el material
        vm.startPrank(jewelFactoryAddress);
        uint256 orderQuantity = 100;
        rawMineral.orderMaterial(rawMineralAddress, uniqueId, orderQuantity);
        vm.stopPrank();
        // RawMineral envía el material
        vm.startPrank(rawMineralAddress);
        // Verificar evento JewelChain__SendNewOrder
        vm.expectEmit(true, true, true, true);
        emit IJewelChain.JewelChain__SendNewOrder(rawMineralAddress, jewelFactoryAddress, uniqueId);
        uint256 indexOrder = 1; // Primer pedido
        rawMineral.sendMaterial(uniqueId, indexOrder);
        // Verificar que el pedido fue eliminado
        IJewelChain.JewelToSend[] memory remainingOrders = rawMineral.getOrderMaterialList();
        assertEq(remainingOrders.length, 0, "Order should be removed after sending");
        // Verificar que el material ya no existe en el array principal
        vm.expectRevert(abi.encodeWithSelector(IJewelChain.RawMineral__UniqueIdNotFound.selector, uniqueId));
        rawMineral.getJewelByUniqueId(uniqueId);
        vm.stopPrank();
    }

    function test_RevertWhen_SendMaterialWithInvalidIndex() public {
        // Setup inicial - crear un material
        vm.startPrank(rawMineralAddress);
        bytes32 name = keccak256("Gold");
        rawMineral.createJewelRecord(name, block.timestamp, 100, abi.encode("Additional data"));

        IJewelChain.JewelRecord[] memory materials = rawMineral.getJewelRecordBySupplier(rawMineralAddress);
        bytes32 uniqueId = materials[0].uniqueId;

        // Intentar enviar con un índice inválido (sin orden previa)
        uint256 invalidIndex = 1;
        vm.expectRevert(); // Debería revertir al intentar acceder a un índice inexistente
        rawMineral.sendMaterial(uniqueId, invalidIndex);

        vm.stopPrank();
    }

    function test_RevertWhen_NonSupplierSendsMaterial() public {
        // Setup inicial - crear un material
        vm.startPrank(rawMineralAddress);
        bytes32 name = keccak256("Gold");
        rawMineral.createJewelRecord(name, block.timestamp, 100, abi.encode("Additional data"));

        IJewelChain.JewelRecord[] memory materials = rawMineral.getJewelRecordBySupplier(rawMineralAddress);
        bytes32 uniqueId = materials[0].uniqueId;
        vm.stopPrank();

        // Intentar enviar material desde una dirección no autorizada
        vm.startPrank(jewelFactoryAddress);
        vm.expectRevert(
            abi.encodeWithSelector(IJewelChain.RawMineral__SupplierIsNotRawMineral.selector, jewelFactoryAddress)
        );
        rawMineral.sendMaterial(uniqueId, 1);
        vm.stopPrank();
    }

    function test_SendMaterial_LastElement() public {
        // Setup - crear un material que será el último elemento
        vm.startPrank(rawMineralAddress);
        bytes32 name = keccak256("Gold");
        rawMineral.createJewelRecord(name, date, quantity, data);

        IJewelChain.JewelRecord[] memory materials = rawMineral.getJewelRecordBySupplier(rawMineralAddress);
        bytes32 uniqueId = materials[0].uniqueId;
        vm.stopPrank();

        // Crear orden
        vm.prank(jewelFactoryAddress);
        rawMineral.orderMaterial(rawMineralAddress, uniqueId, 50);

        // Enviar material (siendo el único/último elemento)
        vm.startPrank(rawMineralAddress);
        rawMineral.sendMaterial(uniqueId, 1);

        // Verificar que se eliminó correctamente
        vm.expectRevert(abi.encodeWithSelector(IJewelChain.RawMineral__UniqueIdNotFound.selector, uniqueId));
        rawMineral.getJewelByUniqueId(uniqueId);
        vm.stopPrank();
    }

    function test_SendMaterial_MultipleOrders() public {
        // Setup - crear múltiples materiales y órdenes
        vm.startPrank(rawMineralAddress);
        bytes32 name1 = keccak256("Gold");
        bytes32 name2 = keccak256("Silver");

        rawMineral.createJewelRecord(name1, date, quantity, data);
        rawMineral.createJewelRecord(name2, date, quantity, data);

        IJewelChain.JewelRecord[] memory materials = rawMineral.getJewelRecordBySupplier(rawMineralAddress);
        bytes32 uniqueId1 = materials[0].uniqueId;
        bytes32 uniqueId2 = materials[1].uniqueId;
        vm.stopPrank();

        // Crear múltiples órdenes
        vm.startPrank(jewelFactoryAddress);
        rawMineral.orderMaterial(rawMineralAddress, uniqueId1, 50);
        rawMineral.orderMaterial(rawMineralAddress, uniqueId2, 30);
        vm.stopPrank();

        // Enviar materiales
        vm.startPrank(rawMineralAddress);
        rawMineral.sendMaterial(uniqueId1, 1);

        // Verificar que solo se eliminó el material correcto
        vm.expectRevert(abi.encodeWithSelector(IJewelChain.RawMineral__UniqueIdNotFound.selector, uniqueId1));
        rawMineral.getJewelByUniqueId(uniqueId1);

        // El segundo material todavía debería existir
        IJewelChain.JewelRecord memory remainingMaterial = rawMineral.getJewelByUniqueId(uniqueId2);
        assertEq(remainingMaterial.name, name2);
        vm.stopPrank();
    }
}
