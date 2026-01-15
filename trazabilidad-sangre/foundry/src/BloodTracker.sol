// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BloodDonation} from "./BloodDonation.sol";
import {BloodDerivative} from "./BloodDerivative.sol";
import {Marketplace} from "./Marketplace.sol";
import {IBlood} from "./IBlood.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract BloodTracker is IBlood, Marketplace, AccessControl {
    error BloodTracker__NotOwner();
    error BloodTracker__IncorrectRole(Role required, Role yourRole);
    error BloodTracker__AddressAlreadyRegistered();
    error BloodTracker__RoleNotAdmitted();
    error BloodTracker__MinimumDonationFeeNotMet();
    error BloodTracker__NotAdmin();
    error BloodTracker__PendingRequestExists();
    error BloodTracker__RequestNotFound();
    error BloodTracker__RequestNotPending();
    error BloodTracker__CompanyNotApproved();
    error BloodTracker__InvalidRole();

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SUPER_ADMIN_ROLE = keccak256("SUPER_ADMIN_ROLE");

    BloodDonation bld;
    BloodDerivative der;
    uint256 constant MINIMUM_DONATION_FEE = 0.001 ether;

    enum Role {
        NO_REGISTERED,
        DONATION_CENTER,
        LABORATORY,
        TRADER
    }

    enum RequestStatus {
        NO_REQUEST,
        PENDING,
        APPROVED,
        REJECTED,
        REVOKED
    }

    // Datos de donante
    struct Donor {
        BloodType bloodType; //No implementado
        uint256 balance;
    }

    // Datos de empresa
    struct Company {
        string name;
        string location;
        Role role;
        RequestStatus status;
        uint256 requestId;
    }

    // Solicitud de registro
    struct RegistrationRequest {
        address applicant;
        string name;
        string location;
        Role requestedRole;
        RequestStatus status;
        uint256 createdAt;
        uint256 processedAt;
        address processedBy;
        string rejectionReason;
    }

    mapping(address donorWallet => Donor) public donors;
    mapping(address companyWallet => Company) public companies;
    mapping(uint256 requestId => RegistrationRequest) public requests;
    mapping(address applicant => uint256 requestId) public activeRequestId;

    uint256 public requestCounter;
    uint256[] private pendingRequestIds;

    event Donation(
        address indexed donor,
        address indexed center,
        uint256 indexed tokenId,
        uint256 value
    );

    event RequestCreated(
        uint256 indexed requestId,
        address indexed applicant,
        Role requestedRole,
        string name,
        uint256 timestamp
    );

    event RequestApproved(
        uint256 indexed requestId,
        address indexed applicant,
        address indexed approvedBy,
        Role role,
        uint256 timestamp
    );

    event RequestRejected(
        uint256 indexed requestId,
        address indexed applicant,
        address indexed rejectedBy,
        string reason,
        uint256 timestamp
    );

    event CompanyRevoked(
        address indexed company,
        address indexed revokedBy,
        Role previousRole,
        uint256 timestamp
    );

    event RoleModified(
        address indexed company,
        address indexed modifiedBy,
        Role oldRole,
        Role newRole,
        uint256 timestamp
    );

    modifier tokenOwnerBld(uint256 tokenId) {
        if (bld.ownerOf(tokenId) != msg.sender) revert BloodTracker__NotOwner();
        _;
    }

    modifier onlyCompanyRole(Role role) {
        if (companies[msg.sender].role != role || companies[msg.sender].status != RequestStatus.APPROVED)
            revert BloodTracker__IncorrectRole(
                role,
                companies[msg.sender].role
            );
        _;
    }

    modifier onlyAdmin() {
        if (!hasRole(ADMIN_ROLE, msg.sender) && !hasRole(SUPER_ADMIN_ROLE, msg.sender))
            revert BloodTracker__NotAdmin();
        _;
    }

    modifier uniqueAddress(address addr) {
        if (
            companies[addr].role != Role.NO_REGISTERED ||
            donors[addr].bloodType != BloodType.IDLE
        ) revert BloodTracker__AddressAlreadyRegistered();
        _;
    }

    constructor(address bldTokenAddress, address derTokenAddress, address initialAdmin) {
        bld = BloodDonation(bldTokenAddress);
        der = BloodDerivative(derTokenAddress);

        // Configurar roles de admin
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(SUPER_ADMIN_ROLE, initialAdmin);
        _grantRole(ADMIN_ROLE, initialAdmin);

        _setRoleAdmin(ADMIN_ROLE, SUPER_ADMIN_ROLE);
    }

    ///////////////////////////
    ////// Registro y Aprobación //////
    ///////////////////////////

    // Función para solicitar registro (reemplaza signUp)
    function requestSignUp(
        string memory _name,
        string memory _location,
        Role _role
    ) external {
        // Verificar que el rol es válido
        if (_role == Role.NO_REGISTERED) revert BloodTracker__InvalidRole();

        // Verificar que no haya una solicitud pendiente
        uint256 existingRequestId = activeRequestId[msg.sender];
        if (existingRequestId != 0 && requests[existingRequestId].status == RequestStatus.PENDING) {
            revert BloodTracker__PendingRequestExists();
        }

        // Verificar que no esté ya registrado y aprobado
        if (companies[msg.sender].status == RequestStatus.APPROVED) {
            revert BloodTracker__AddressAlreadyRegistered();
        }

        // Crear nueva solicitud
        requestCounter++;
        uint256 requestId = requestCounter;

        requests[requestId] = RegistrationRequest({
            applicant: msg.sender,
            name: _name,
            location: _location,
            requestedRole: _role,
            status: RequestStatus.PENDING,
            createdAt: block.timestamp,
            processedAt: 0,
            processedBy: address(0),
            rejectionReason: ""
        });

        activeRequestId[msg.sender] = requestId;
        pendingRequestIds.push(requestId);

        emit RequestCreated(requestId, msg.sender, _role, _name, block.timestamp);
    }

    // Aprobar solicitud de registro
    function approveRequest(uint256 _requestId) external onlyAdmin {
        RegistrationRequest storage request = requests[_requestId];

        if (request.applicant == address(0)) revert BloodTracker__RequestNotFound();
        if (request.status != RequestStatus.PENDING) revert BloodTracker__RequestNotPending();

        // Actualizar solicitud
        request.status = RequestStatus.APPROVED;
        request.processedAt = block.timestamp;
        request.processedBy = msg.sender;

        // Registrar empresa
        companies[request.applicant] = Company({
            name: request.name,
            location: request.location,
            role: request.requestedRole,
            status: RequestStatus.APPROVED,
            requestId: _requestId
        });

        // Remover de pendientes
        _removePendingRequest(_requestId);

        emit RequestApproved(_requestId, request.applicant, msg.sender, request.requestedRole, block.timestamp);
    }

    // Rechazar solicitud de registro
    function rejectRequest(uint256 _requestId, string memory _reason) external onlyAdmin {
        RegistrationRequest storage request = requests[_requestId];

        if (request.applicant == address(0)) revert BloodTracker__RequestNotFound();
        if (request.status != RequestStatus.PENDING) revert BloodTracker__RequestNotPending();
        if (bytes(_reason).length == 0) revert BloodTracker__InvalidRole();

        // Actualizar solicitud
        request.status = RequestStatus.REJECTED;
        request.processedAt = block.timestamp;
        request.processedBy = msg.sender;
        request.rejectionReason = _reason;

        // Remover de pendientes
        _removePendingRequest(_requestId);

        emit RequestRejected(_requestId, request.applicant, msg.sender, _reason, block.timestamp);
    }

    // Revocar empresa aprobada
    function revokeCompany(address _company) external onlyAdmin {
        Company storage company = companies[_company];

        if (company.status != RequestStatus.APPROVED) revert BloodTracker__CompanyNotApproved();

        Role previousRole = company.role;
        company.status = RequestStatus.REVOKED;

        // Actualizar también la solicitud original
        if (company.requestId != 0) {
            requests[company.requestId].status = RequestStatus.REVOKED;
        }

        emit CompanyRevoked(_company, msg.sender, previousRole, block.timestamp);
    }

    // Modificar rol de empresa
    function modifyRole(address _company, Role _newRole) external onlyAdmin {
        Company storage company = companies[_company];

        if (company.status != RequestStatus.APPROVED) revert BloodTracker__CompanyNotApproved();
        if (_newRole == Role.NO_REGISTERED) revert BloodTracker__InvalidRole();

        Role oldRole = company.role;
        company.role = _newRole;

        emit RoleModified(_company, msg.sender, oldRole, _newRole, block.timestamp);
    }

    // Agregar administrador (solo SUPER_ADMIN)
    function addAdmin(address _admin) external {
        if (!hasRole(SUPER_ADMIN_ROLE, msg.sender)) revert BloodTracker__NotAdmin();
        grantRole(ADMIN_ROLE, _admin);
    }

    // Remover administrador (solo SUPER_ADMIN)
    function removeAdmin(address _admin) external {
        if (!hasRole(SUPER_ADMIN_ROLE, msg.sender)) revert BloodTracker__NotAdmin();
        revokeRole(ADMIN_ROLE, _admin);
    }

    // Helper function para remover de pendientes
    function _removePendingRequest(uint256 _requestId) private {
        for (uint256 i = 0; i < pendingRequestIds.length; i++) {
            if (pendingRequestIds[i] == _requestId) {
                pendingRequestIds[i] = pendingRequestIds[pendingRequestIds.length - 1];
                pendingRequestIds.pop();
                break;
            }
        }
    }

    ///////////////////////////
    ////// Operaciones Principales //////
    ///////////////////////////

    // Función principal para que los centros de extracción puedan crear una nueva donación
    function donate(
        address _from
    )
        external
        payable
        onlyCompanyRole(Role.DONATION_CENTER)
        uniqueAddress(_from)
        returns (uint256)
    {
        if (msg.value < MINIMUM_DONATION_FEE) {
            revert BloodTracker__MinimumDonationFeeNotMet();
        }
        // Sumamos los ethers al balance del donante
        donors[_from].balance += msg.value;
        // Creamos el token que representa la unidad de sangre
        uint256 tokenId = bld.mint(msg.sender);

        emit Donation(_from, msg.sender, tokenId, msg.value);

        return tokenId;
    }

    // Función para analisar la sangre -- PENDIENTE DE MOMENTO
    // function analysis(uint _tokenId, AnalysisResult _result) external {
    //     require(_ownerOf(_tokenId) == msg.sender, "Not owner");
    //     require(companies[msg.sender].role == Role.LABORATORY, "Not laboratory");
    //     require(products[_tokenId].derivative == Derivative.RAW, "Not raw blood");
    //     if (_result == AnalysisResult.Positive){

    //     } else {
    //         _burn(_tokenId);
    //     }
    // }

    // Función para que los laboratorios puedan procesar las unidades de sangre en hemoderivados
    function process(
        uint256 _tokenId
    )
        external
        tokenOwnerBld(_tokenId)
        onlyCompanyRole(Role.LABORATORY)
        returns (uint256, uint256, uint256)
    {
        uint256 plasmaId = der.mint(msg.sender, _tokenId, Derivative.PLASMA);
        uint256 erythrocytesId = der.mint(
            msg.sender,
            _tokenId,
            Derivative.ERYTHROCYTES
        );
        uint256 plateletsId = der.mint(
            msg.sender,
            _tokenId,
            Derivative.PLATELETS
        );

        bld.updateDonation(_tokenId, plasmaId, erythrocytesId, plateletsId);

        return (plasmaId, erythrocytesId, plateletsId);
    }

    ///////////////////////////
    ////////Marketplace////////
    ///////////////////////////

    // Functions override to apply roles to it
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) public override {
        Role role = companies[msg.sender].role;
        if (role != Role.LABORATORY && role != Role.TRADER)
            revert BloodTracker__IncorrectRole(
                role,
                companies[msg.sender].role
            );
        super.listItem(nftAddress, tokenId, price);
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId // isNotOwner(nftAddress, tokenId, msg.sender)
    ) public payable override onlyCompanyRole(Role.TRADER) {
        super.buyItem(nftAddress, tokenId);
    }

    ///////////////////////////
    ////////Getters////////
    ///////////////////////////

    function getMinimumDonationFee() public pure returns (uint256) {
        return MINIMUM_DONATION_FEE;
    }

    // Obtener lista de IDs de solicitudes pendientes
    function getPendingRequests() external view returns (uint256[] memory) {
        return pendingRequestIds;
    }

    // Obtener detalles de una solicitud
    function getRequestDetails(uint256 _requestId) external view returns (RegistrationRequest memory) {
        return requests[_requestId];
    }

    // Verificar si una dirección es administrador
    function isAdmin(address _account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, _account) || hasRole(SUPER_ADMIN_ROLE, _account);
    }

    // Obtener status de una empresa
    function getCompanyStatus(address _company) external view returns (RequestStatus) {
        return companies[_company].status;
    }

    // Obtener request ID activo de un aplicante
    function getActiveRequestId(address _applicant) external view returns (uint256) {
        return activeRequestId[_applicant];
    }

    // Obtener total de solicitudes
    function getTotalRequests() external view returns (uint256) {
        return requestCounter;
    }
}
