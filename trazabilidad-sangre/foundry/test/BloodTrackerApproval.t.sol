// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {BloodDonation} from "../src/BloodDonation.sol";
import {BloodDerivative} from "../src/BloodDerivative.sol";
import {BloodTracker} from "../src/BloodTracker.sol";

contract BloodTrackerApprovalTest is Test {
    BloodDonation bld;
    BloodDerivative der;
    BloodTracker bldTracker;

    address immutable ADMIN = makeAddr("ADMIN");
    address immutable ADMIN2 = makeAddr("ADMIN2");
    address immutable USER = makeAddr("USER");
    address immutable DONATION_CENTER = makeAddr("DONATION_CENTER");
    address immutable LABORATORY = makeAddr("LABORATORY");
    address immutable TRADER = makeAddr("TRADER");

    uint256 MINIMUM_DONATION_FEE;

    function setUp() external {
        // Desplegar contratos con admin
        vm.startPrank(ADMIN);
        bld = new BloodDonation();
        der = new BloodDerivative();
        bldTracker = new BloodTracker(address(bld), address(der), ADMIN);
        bld.transferOwnership(address(bldTracker));
        der.transferOwnership(address(bldTracker));
        vm.stopPrank();

        MINIMUM_DONATION_FEE = bldTracker.getMinimumDonationFee();
    }

    // Test 1: Crear solicitud exitosamente
    function testRequestSignUp() public {
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        // Verificar que la solicitud se creó
        uint256 requestId = bldTracker.getActiveRequestId(DONATION_CENTER);
        assertEq(requestId, 1);

        BloodTracker.RegistrationRequest memory request = bldTracker.getRequestDetails(requestId);
        assertEq(request.applicant, DONATION_CENTER);
        assertEq(request.name, "Donation Center");
        assertEq(request.location, "Madrid");
        assertTrue(uint(request.status) == uint(BloodTracker.RequestStatus.PENDING));
    }

    // Test 2: No permitir solicitudes duplicadas
    function testRevertRequestSignUpDuplicate() public {
        vm.startPrank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        // Debería revertir con BloodTracker__PendingRequestExists
        vm.expectRevert(BloodTracker.BloodTracker__PendingRequestExists.selector);
        bldTracker.requestSignUp("Donation Center 2", "Barcelona", BloodTracker.Role.DONATION_CENTER);
        vm.stopPrank();
    }

    // Test 3: No permitir rol NO_REGISTERED
    function testRevertRequestSignUpInvalidRole() public {
        vm.prank(DONATION_CENTER);
        vm.expectRevert(BloodTracker.BloodTracker__InvalidRole.selector);
        bldTracker.requestSignUp("Company", "Madrid", BloodTracker.Role.NO_REGISTERED);
    }

    // Test 4: Admin aprueba solicitud exitosamente
    function testApproveRequest() public {
        // Crear solicitud
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        uint256 requestId = bldTracker.getActiveRequestId(DONATION_CENTER);

        // Aprobar como admin
        vm.prank(ADMIN);
        bldTracker.approveRequest(requestId);

        // Verificar que la empresa está aprobada
        (string memory name, string memory location, BloodTracker.Role role, BloodTracker.RequestStatus status,) = bldTracker.companies(DONATION_CENTER);
        assertEq(name, "Donation Center");
        assertEq(location, "Madrid");
        assertTrue(uint(role) == uint(BloodTracker.Role.DONATION_CENTER));
        assertTrue(uint(status) == uint(BloodTracker.RequestStatus.APPROVED));

        // Verificar que la solicitud está aprobada
        BloodTracker.RegistrationRequest memory request = bldTracker.getRequestDetails(requestId);
        assertTrue(uint(request.status) == uint(BloodTracker.RequestStatus.APPROVED));
        assertEq(request.processedBy, ADMIN);
    }

    // Test 5: No-admin no puede aprobar
    function testRevertApproveRequestNonAdmin() public {
        // Crear solicitud
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        uint256 requestId = bldTracker.getActiveRequestId(DONATION_CENTER);

        // Intentar aprobar como usuario normal (debería fallar)
        vm.prank(USER);
        vm.expectRevert(BloodTracker.BloodTracker__NotAdmin.selector);
        bldTracker.approveRequest(requestId);
    }

    // Test 6: Rechazar solicitud con razón
    function testRejectRequest() public {
        // Crear solicitud
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        uint256 requestId = bldTracker.getActiveRequestId(DONATION_CENTER);

        // Rechazar como admin
        string memory reason = "Documentacion incompleta";
        vm.prank(ADMIN);
        bldTracker.rejectRequest(requestId, reason);

        // Verificar que la solicitud está rechazada
        BloodTracker.RegistrationRequest memory request = bldTracker.getRequestDetails(requestId);
        assertTrue(uint(request.status) == uint(BloodTracker.RequestStatus.REJECTED));
        assertEq(request.rejectionReason, reason);
        assertEq(request.processedBy, ADMIN);
    }

    // Test 7: No se puede rechazar sin razón
    function testRevertRejectRequestWithoutReason() public {
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        uint256 requestId = bldTracker.getActiveRequestId(DONATION_CENTER);

        vm.prank(ADMIN);
        vm.expectRevert(BloodTracker.BloodTracker__InvalidRole.selector);
        bldTracker.rejectRequest(requestId, "");
    }

    // Test 8: Revocar empresa aprobada
    function testRevokeCompany() public {
        // Crear y aprobar empresa
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        uint256 requestId = bldTracker.getActiveRequestId(DONATION_CENTER);

        vm.prank(ADMIN);
        bldTracker.approveRequest(requestId);

        // Revocar empresa
        vm.prank(ADMIN);
        bldTracker.revokeCompany(DONATION_CENTER);

        // Verificar que está revocada
        (,,, BloodTracker.RequestStatus status,) = bldTracker.companies(DONATION_CENTER);
        assertTrue(uint(status) == uint(BloodTracker.RequestStatus.REVOKED));
    }

    // Test 9: No se puede revocar empresa no aprobada
    function testRevertRevokeCompanyNotApproved() public {
        vm.prank(ADMIN);
        vm.expectRevert(BloodTracker.BloodTracker__CompanyNotApproved.selector);
        bldTracker.revokeCompany(DONATION_CENTER);
    }

    // Test 10: Modificar rol de empresa
    function testModifyRole() public {
        // Crear y aprobar empresa
        vm.prank(LABORATORY);
        bldTracker.requestSignUp("Laboratory", "Madrid", BloodTracker.Role.LABORATORY);

        uint256 requestId = bldTracker.getActiveRequestId(LABORATORY);

        vm.prank(ADMIN);
        bldTracker.approveRequest(requestId);

        // Modificar rol
        vm.prank(ADMIN);
        bldTracker.modifyRole(LABORATORY, BloodTracker.Role.TRADER);

        // Verificar nuevo rol
        (,, BloodTracker.Role role,,) = bldTracker.companies(LABORATORY);
        assertTrue(uint(role) == uint(BloodTracker.Role.TRADER));
    }

    // Test 11: No se puede modificar rol a NO_REGISTERED
    function testRevertModifyRoleToNoRegistered() public {
        // Crear y aprobar empresa
        vm.prank(LABORATORY);
        bldTracker.requestSignUp("Laboratory", "Madrid", BloodTracker.Role.LABORATORY);

        vm.prank(ADMIN);
        bldTracker.approveRequest(1);

        // Intentar modificar a NO_REGISTERED
        vm.prank(ADMIN);
        vm.expectRevert(BloodTracker.BloodTracker__InvalidRole.selector);
        bldTracker.modifyRole(LABORATORY, BloodTracker.Role.NO_REGISTERED);
    }

    // Test 12: Agregar y remover admin
    function testAddAndRemoveAdmin() public {
        // Agregar admin2
        vm.prank(ADMIN);
        bldTracker.addAdmin(ADMIN2);

        // Verificar que es admin
        assertTrue(bldTracker.isAdmin(ADMIN2));

        // Remover admin2
        vm.prank(ADMIN);
        bldTracker.removeAdmin(ADMIN2);

        // Verificar que ya no es admin
        assertFalse(bldTracker.isAdmin(ADMIN2));
    }

    // Test 13: Solo SUPER_ADMIN puede agregar admins
    function testRevertAddAdminNonSuperAdmin() public {
        vm.prank(USER);
        vm.expectRevert(BloodTracker.BloodTracker__NotAdmin.selector);
        bldTracker.addAdmin(ADMIN2);
    }

    // Test 14: Flujo completo - Solicitud → Aprobación → Operación (donate)
    function testFullApprovalFlow() public {
        // 1. Solicitud
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        // 2. Aprobación
        vm.prank(ADMIN);
        bldTracker.approveRequest(1);

        // 3. Operación (donar)
        vm.deal(DONATION_CENTER, 1 ether);
        vm.prank(DONATION_CENTER);
        uint256 tokenId = bldTracker.donate{value: MINIMUM_DONATION_FEE}(USER);

        // Verificar que la donación se creó
        assertEq(bld.ownerOf(tokenId), DONATION_CENTER);
    }

    // Test 15: No puede operar si está PENDING
    function testRevertOperateWithoutApproval() public {
        // Crear solicitud pero NO aprobar
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        // Intentar donar sin aprobación
        vm.deal(DONATION_CENTER, 1 ether);
        vm.prank(DONATION_CENTER);
        vm.expectRevert();
        bldTracker.donate{value: MINIMUM_DONATION_FEE}(USER);
    }

    // Test 16: No puede operar después de revocación
    function testRevertOperateAfterRevocation() public {
        // Crear, aprobar y luego revocar
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("Donation Center", "Madrid", BloodTracker.Role.DONATION_CENTER);

        vm.prank(ADMIN);
        bldTracker.approveRequest(1);

        vm.prank(ADMIN);
        bldTracker.revokeCompany(DONATION_CENTER);

        // Intentar donar después de revocación
        vm.deal(DONATION_CENTER, 1 ether);
        vm.prank(DONATION_CENTER);
        vm.expectRevert();
        bldTracker.donate{value: MINIMUM_DONATION_FEE}(USER);
    }

    // Test 17: Obtener lista de solicitudes pendientes
    function testGetPendingRequests() public {
        // Crear 3 solicitudes
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("DC", "Madrid", BloodTracker.Role.DONATION_CENTER);

        vm.prank(LABORATORY);
        bldTracker.requestSignUp("Lab", "Barcelona", BloodTracker.Role.LABORATORY);

        vm.prank(TRADER);
        bldTracker.requestSignUp("Trader", "Valencia", BloodTracker.Role.TRADER);

        // Obtener pendientes
        uint256[] memory pending = bldTracker.getPendingRequests();
        assertEq(pending.length, 3);

        // Aprobar una
        vm.prank(ADMIN);
        bldTracker.approveRequest(1);

        // Verificar que quedan 2 pendientes
        pending = bldTracker.getPendingRequests();
        assertEq(pending.length, 2);
    }

    // Test 18: Empresa rechazada puede solicitar nuevamente
    function testRejectedCanReapply() public {
        // Primera solicitud
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("DC", "Madrid", BloodTracker.Role.DONATION_CENTER);

        // Rechazar
        vm.prank(ADMIN);
        bldTracker.rejectRequest(1, "Documentos incorrectos");

        // Segunda solicitud (debería funcionar)
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("DC Corregido", "Madrid", BloodTracker.Role.DONATION_CENTER);

        uint256 newRequestId = bldTracker.getActiveRequestId(DONATION_CENTER);
        assertEq(newRequestId, 2);
    }

    // Test 19: Verificar contador de solicitudes
    function testRequestCounter() public {
        assertEq(bldTracker.getTotalRequests(), 0);

        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("DC", "Madrid", BloodTracker.Role.DONATION_CENTER);

        assertEq(bldTracker.getTotalRequests(), 1);

        vm.prank(LABORATORY);
        bldTracker.requestSignUp("Lab", "Barcelona", BloodTracker.Role.LABORATORY);

        assertEq(bldTracker.getTotalRequests(), 2);
    }

    // Test 20: Verificar status de empresa
    function testGetCompanyStatus() public {
        // Sin registro
        BloodTracker.RequestStatus status = bldTracker.getCompanyStatus(DONATION_CENTER);
        assertTrue(uint(status) == uint(BloodTracker.RequestStatus.NO_REQUEST));

        // Solicitud pendiente
        vm.prank(DONATION_CENTER);
        bldTracker.requestSignUp("DC", "Madrid", BloodTracker.Role.DONATION_CENTER);

        status = bldTracker.getCompanyStatus(DONATION_CENTER);
        assertTrue(uint(status) == uint(BloodTracker.RequestStatus.NO_REQUEST)); // Company aún no existe

        // Aprobada
        vm.prank(ADMIN);
        bldTracker.approveRequest(1);

        status = bldTracker.getCompanyStatus(DONATION_CENTER);
        assertTrue(uint(status) == uint(BloodTracker.RequestStatus.APPROVED));
    }
}
