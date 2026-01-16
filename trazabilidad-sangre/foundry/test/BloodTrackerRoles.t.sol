// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {BloodDonation} from "../src/BloodDonation.sol";
import {BloodDerivative} from "../src/BloodDerivative.sol";
import {BloodTracker} from "../src/BloodTracker.sol";
import {IBlood} from "../src/IBlood.sol";

contract BloodTrackerRolesTest is Test {
    BloodDonation bld;
    BloodDerivative der;
    BloodTracker bldTracker;

    address immutable ADMIN = makeAddr("ADMIN");
    address immutable DONATION_CENTER = makeAddr("DONATION_CENTER");
    address immutable LABORATORY = makeAddr("LABORATORY");
    address immutable TRADER = makeAddr("TRADER");
    address immutable HOSPITAL = makeAddr("HOSPITAL");
    address immutable MANUFACTURER = makeAddr("MANUFACTURER");
    address immutable DONOR = makeAddr("DONOR");

    uint256 MINIMUM_DONATION_FEE;

    // Eventos
    event PatientAdministered(
        uint256 indexed tokenId,
        address indexed hospital,
        string patientId,
        bool isBloodBag,
        uint256 timestamp
    );

    event BatchCreated(
        uint256 indexed batchId,
        address indexed manufacturer,
        uint256[] derivativeIds,
        string productType,
        uint256 timestamp
    );

    function setUp() external {
        // Desplegar contratos con admin
        vm.startPrank(ADMIN);
        bld = new BloodDonation();
        der = new BloodDerivative();
        bldTracker = new BloodTracker(address(bld), address(der), ADMIN);
        bld.transferOwnership(address(bldTracker));
        der.transferOwnership(address(bldTracker));
        vm.stopPrank();

        vm.deal(DONATION_CENTER, 10 ether);
        vm.deal(LABORATORY, 10 ether);
        vm.deal(TRADER, 10 ether);
        vm.deal(HOSPITAL, 10 ether);
        vm.deal(MANUFACTURER, 10 ether);
        MINIMUM_DONATION_FEE = bldTracker.getMinimumDonationFee();

        // Registrar y aprobar todos los roles
        _registerAndApproveRole(DONATION_CENTER, BloodTracker.Role.DONATION_CENTER, "Centro de Donacion", "Madrid");
        _registerAndApproveRole(LABORATORY, BloodTracker.Role.LABORATORY, "Laboratorio", "Barcelona");
        _registerAndApproveRole(TRADER, BloodTracker.Role.TRADER, "Trader", "Valencia");
        _registerAndApproveRole(HOSPITAL, BloodTracker.Role.HOSPITAL, "Hospital Central", "Sevilla");
        _registerAndApproveRole(MANUFACTURER, BloodTracker.Role.MANUFACTURER, "Cosmetics Inc", "Bilbao");
    }

    function _registerAndApproveRole(
        address user,
        BloodTracker.Role role,
        string memory name,
        string memory location
    ) internal {
        vm.prank(user);
        bldTracker.requestSignUp(name, location, role);

        uint256 requestId = bldTracker.getActiveRequestId(user);

        vm.prank(ADMIN);
        bldTracker.approveRequest(requestId);
    }

    function _createDonationAndProcess() internal returns (uint256 donationId, uint256 plasmaId, uint256 erythrocytesId, uint256 plateletsId) {
        // Centro de donación crea una donación
        vm.prank(DONATION_CENTER);
        donationId = bldTracker.donate{value: MINIMUM_DONATION_FEE}(DONOR);

        // Transferir a laboratorio
        vm.prank(DONATION_CENTER);
        bld.transferFrom(DONATION_CENTER, LABORATORY, donationId);

        // Laboratorio procesa la donación
        vm.prank(LABORATORY);
        (plasmaId, erythrocytesId, plateletsId) = bldTracker.process(donationId);
    }

    ///////////////////////////
    // Tests de Marketplace - Hospital
    ///////////////////////////

    function test_HospitalCannotListItems() public {
        vm.prank(HOSPITAL);
        vm.expectRevert(BloodTracker.BloodTracker__HospitalCannotListItems.selector);
        bldTracker.listItem(address(der), 1, 1 ether);
    }

    function test_HospitalCanBuyBloodDonation() public {
        // Crear donación
        vm.prank(DONATION_CENTER);
        uint256 donationId = bldTracker.donate{value: MINIMUM_DONATION_FEE}(DONOR);

        // Transferir a laboratorio
        vm.prank(DONATION_CENTER);
        bld.transferFrom(DONATION_CENTER, LABORATORY, donationId);

        // Laboratorio lista la bolsa completa
        vm.prank(LABORATORY);
        bld.approve(address(bldTracker), donationId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(bld), donationId, 0.5 ether);

        // Hospital compra la bolsa
        vm.prank(HOSPITAL);
        bldTracker.buyItem{value: 0.5 ether}(address(bld), donationId);

        assertEq(bld.ownerOf(donationId), HOSPITAL);
    }

    function test_HospitalCanBuyBloodDerivative() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        // Laboratorio lista el derivado
        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        // Hospital compra el derivado
        vm.prank(HOSPITAL);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        assertEq(der.ownerOf(plasmaId), HOSPITAL);
    }

    ///////////////////////////
    // Tests de Marketplace - Manufacturer
    ///////////////////////////

    function test_ManufacturerCannotListItems() public {
        vm.prank(MANUFACTURER);
        vm.expectRevert(BloodTracker.BloodTracker__ManufacturerCannotListItems.selector);
        bldTracker.listItem(address(der), 1, 1 ether);
    }

    function test_ManufacturerCanBuyBloodDerivative() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        // Laboratorio lista el derivado
        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        // Manufacturer compra el derivado
        vm.prank(MANUFACTURER);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        assertEq(der.ownerOf(plasmaId), MANUFACTURER);
    }

    function test_ManufacturerCannotBuyBloodDonation() public {
        // Crear donación
        vm.prank(DONATION_CENTER);
        uint256 donationId = bldTracker.donate{value: MINIMUM_DONATION_FEE}(DONOR);

        // Transferir a laboratorio
        vm.prank(DONATION_CENTER);
        bld.transferFrom(DONATION_CENTER, LABORATORY, donationId);

        // Laboratorio lista la bolsa
        vm.prank(LABORATORY);
        bld.approve(address(bldTracker), donationId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(bld), donationId, 0.5 ether);

        // Manufacturer intenta comprar (debe fallar)
        vm.prank(MANUFACTURER);
        vm.expectRevert(BloodTracker.BloodTracker__InvalidTokenType.selector);
        bldTracker.buyItem{value: 0.5 ether}(address(bld), donationId);
    }

    ///////////////////////////
    // Tests de Laboratory listItem
    ///////////////////////////

    function test_LaboratoryCanListBloodDonation() public {
        // Crear donación
        vm.prank(DONATION_CENTER);
        uint256 donationId = bldTracker.donate{value: MINIMUM_DONATION_FEE}(DONOR);

        // Transferir a laboratorio
        vm.prank(DONATION_CENTER);
        bld.transferFrom(DONATION_CENTER, LABORATORY, donationId);

        // Laboratorio lista la bolsa completa
        vm.prank(LABORATORY);
        bld.approve(address(bldTracker), donationId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(bld), donationId, 0.5 ether);

        (uint256 price, address seller) = bldTracker.getListing(address(bld), donationId);
        assertEq(price, 0.5 ether);
        assertEq(seller, LABORATORY);
    }

    function test_LaboratoryCanListBloodDerivative() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        // Laboratorio lista el derivado
        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        (uint256 price, address seller) = bldTracker.getListing(address(der), plasmaId);
        assertEq(price, 0.3 ether);
        assertEq(seller, LABORATORY);
    }

    ///////////////////////////
    // Tests de validaciones de roles
    ///////////////////////////

    function test_DonationCenterCannotList() public {
        vm.prank(DONATION_CENTER);
        uint256 donationId = bldTracker.donate{value: MINIMUM_DONATION_FEE}(DONOR);

        vm.prank(DONATION_CENTER);
        bld.approve(address(bldTracker), donationId);
        vm.prank(DONATION_CENTER);
        vm.expectRevert(BloodTracker.BloodTracker__DonationCenterCannotList.selector);
        bldTracker.listItem(address(bld), donationId, 0.5 ether);
    }

    function test_LaboratoryCannotBuy() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        // Trader lista un derivado
        vm.prank(LABORATORY);
        der.transferFrom(LABORATORY, TRADER, plasmaId);

        vm.prank(TRADER);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(TRADER);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        // Laboratory intenta comprar (debe fallar)
        vm.prank(LABORATORY);
        vm.expectRevert(BloodTracker.BloodTracker__CannotBuyItems.selector);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);
    }

    function test_DonationCenterCannotBuy() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        // Laboratorio lista un derivado
        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        // Donation Center intenta comprar (debe fallar)
        vm.prank(DONATION_CENTER);
        vm.expectRevert(BloodTracker.BloodTracker__CannotBuyItems.selector);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);
    }

    ///////////////////////////
    // Tests de registerPatientAdministration
    ///////////////////////////

    function test_HospitalCanRegisterPatientAdministrationWithBloodBag() public {
        // Hospital compra una bolsa completa
        vm.prank(DONATION_CENTER);
        uint256 donationId = bldTracker.donate{value: MINIMUM_DONATION_FEE}(DONOR);

        vm.prank(DONATION_CENTER);
        bld.transferFrom(DONATION_CENTER, LABORATORY, donationId);

        vm.prank(LABORATORY);
        bld.approve(address(bldTracker), donationId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(bld), donationId, 0.5 ether);

        vm.prank(HOSPITAL);
        bldTracker.buyItem{value: 0.5 ether}(address(bld), donationId);

        // Hospital registra administración a paciente
        vm.prank(HOSPITAL);
        bldTracker.registerPatientAdministration(
            donationId,
            true, // isBloodBag
            "PATIENT_HASH_123",
            "Trauma surgery - blood loss"
        );

        (
            uint256 tokenId,
            string memory patientId,
            string memory medicalReason,
            uint256 timestamp,
            address hospital
        ) = bldTracker.administeredToPatients(donationId);

        assertEq(tokenId, donationId);
        assertEq(patientId, "PATIENT_HASH_123");
        assertEq(medicalReason, "Trauma surgery - blood loss");
        assertGt(timestamp, 0);
        assertEq(hospital, HOSPITAL);
    }

    function test_HospitalCanRegisterPatientAdministrationWithDerivative() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        // Hospital compra derivado
        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        vm.prank(HOSPITAL);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        // Hospital registra administración
        vm.prank(HOSPITAL);
        bldTracker.registerPatientAdministration(
            plasmaId,
            false, // isBloodBag = false (es derivado)
            "PATIENT_HASH_456",
            "Plasma replacement therapy"
        );

        (
            uint256 tokenId,
            string memory patientId,
            string memory medicalReason,
            uint256 timestamp,
            address hospital
        ) = bldTracker.administeredToPatients(plasmaId);

        assertEq(tokenId, plasmaId);
        assertEq(patientId, "PATIENT_HASH_456");
        assertEq(medicalReason, "Plasma replacement therapy");
        assertGt(timestamp, 0);
        assertEq(hospital, HOSPITAL);
    }

    function test_HospitalCannotRegisterAdministrationWithoutOwnership() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        // Hospital NO posee el derivado
        vm.prank(HOSPITAL);
        vm.expectRevert(BloodTracker.BloodTracker__NotOwner.selector);
        bldTracker.registerPatientAdministration(
            plasmaId,
            false,
            "PATIENT_HASH_789",
            "Some reason"
        );
    }

    function test_HospitalCannotRegisterAdministrationTwice() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        // Hospital compra y registra
        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        vm.prank(HOSPITAL);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        vm.prank(HOSPITAL);
        bldTracker.registerPatientAdministration(
            plasmaId,
            false,
            "PATIENT_1",
            "Reason 1"
        );

        // Intenta registrar de nuevo
        vm.prank(HOSPITAL);
        vm.expectRevert(BloodTracker.BloodTracker__AlreadyAdministered.selector);
        bldTracker.registerPatientAdministration(
            plasmaId,
            false,
            "PATIENT_2",
            "Reason 2"
        );
    }

    function test_HospitalCannotRegisterWithEmptyPatientInfo() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        vm.prank(HOSPITAL);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        vm.prank(HOSPITAL);
        vm.expectRevert(BloodTracker.BloodTracker__MustProvidePatientInfo.selector);
        bldTracker.registerPatientAdministration(
            plasmaId,
            false,
            "", // patientId vacío
            "Reason"
        );
    }

    ///////////////////////////
    // Tests de createManufacturedBatch
    ///////////////////////////

    function test_ManufacturerCanCreateBatch() public {
        (,uint256 plasmaId, uint256 erythrocytesId,) = _createDonationAndProcess();

        // Manufacturer compra 2 derivados
        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        vm.prank(LABORATORY);
        der.approve(address(bldTracker), erythrocytesId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), erythrocytesId, 0.3 ether);

        vm.prank(MANUFACTURER);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        vm.prank(MANUFACTURER);
        bldTracker.buyItem{value: 0.3 ether}(address(der), erythrocytesId);

        // Crear lote
        uint256[] memory derivativeIds = new uint256[](2);
        derivativeIds[0] = plasmaId;
        derivativeIds[1] = erythrocytesId;

        vm.prank(MANUFACTURER);
        uint256 batchId = bldTracker.createManufacturedBatch(derivativeIds, "SERUM");

        assertEq(batchId, 1);

        // Verificar que los derivados están marcados como usados
        assertTrue(bldTracker.derivativesUsedInBatch(plasmaId));
        assertTrue(bldTracker.derivativesUsedInBatch(erythrocytesId));
    }

    function test_ManufacturerCannotCreateBatchWithoutOwnership() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        // Manufacturer NO posee el derivado
        uint256[] memory derivativeIds = new uint256[](1);
        derivativeIds[0] = plasmaId;

        vm.prank(MANUFACTURER);
        vm.expectRevert(BloodTracker.BloodTracker__NotOwner.selector);
        bldTracker.createManufacturedBatch(derivativeIds, "SERUM");
    }

    function test_ManufacturerCannotReuseDerivativeInBatch() public {
        (,uint256 plasmaId, uint256 erythrocytesId,) = _createDonationAndProcess();

        // Manufacturer compra 2 derivados
        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        vm.prank(LABORATORY);
        der.approve(address(bldTracker), erythrocytesId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), erythrocytesId, 0.3 ether);

        vm.prank(MANUFACTURER);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        vm.prank(MANUFACTURER);
        bldTracker.buyItem{value: 0.3 ether}(address(der), erythrocytesId);

        // Crear primer lote
        uint256[] memory derivativeIds1 = new uint256[](1);
        derivativeIds1[0] = plasmaId;

        vm.prank(MANUFACTURER);
        bldTracker.createManufacturedBatch(derivativeIds1, "SERUM");

        // Intentar crear segundo lote con mismo derivado
        uint256[] memory derivativeIds2 = new uint256[](1);
        derivativeIds2[0] = plasmaId;

        vm.prank(MANUFACTURER);
        vm.expectRevert(BloodTracker.BloodTracker__DerivativeAlreadyUsedInBatch.selector);
        bldTracker.createManufacturedBatch(derivativeIds2, "CREAM");
    }

    function test_ManufacturerCannotCreateBatchWithEmptyArray() public {
        uint256[] memory derivativeIds = new uint256[](0);

        vm.prank(MANUFACTURER);
        vm.expectRevert(BloodTracker.BloodTracker__MustProvideProductInfo.selector);
        bldTracker.createManufacturedBatch(derivativeIds, "SERUM");
    }

    function test_ManufacturerCannotCreateBatchWithEmptyProductType() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        vm.prank(MANUFACTURER);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        uint256[] memory derivativeIds = new uint256[](1);
        derivativeIds[0] = plasmaId;

        vm.prank(MANUFACTURER);
        vm.expectRevert(BloodTracker.BloodTracker__MustProvideProductInfo.selector);
        bldTracker.createManufacturedBatch(derivativeIds, ""); // productType vacío
    }

    ///////////////////////////
    // Tests de Eventos
    ///////////////////////////

    function test_PatientAdministeredEventEmitted() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        vm.prank(HOSPITAL);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        vm.prank(HOSPITAL);
        vm.expectEmit(true, true, false, true);
        emit PatientAdministered(
            plasmaId,
            HOSPITAL,
            "PATIENT_123",
            false,
            block.timestamp
        );
        bldTracker.registerPatientAdministration(
            plasmaId,
            false,
            "PATIENT_123",
            "Treatment"
        );
    }

    function test_BatchCreatedEventEmitted() public {
        (,uint256 plasmaId,,) = _createDonationAndProcess();

        vm.prank(LABORATORY);
        der.approve(address(bldTracker), plasmaId);
        vm.prank(LABORATORY);
        bldTracker.listItem(address(der), plasmaId, 0.3 ether);

        vm.prank(MANUFACTURER);
        bldTracker.buyItem{value: 0.3 ether}(address(der), plasmaId);

        uint256[] memory derivativeIds = new uint256[](1);
        derivativeIds[0] = plasmaId;

        vm.prank(MANUFACTURER);
        vm.expectEmit(true, true, false, true);
        emit BatchCreated(
            1,
            MANUFACTURER,
            derivativeIds,
            "SERUM",
            block.timestamp
        );
        bldTracker.createManufacturedBatch(derivativeIds, "SERUM");
    }
}
