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
    error BloodTracker__HospitalCannotListItems();
    error BloodTracker__ManufacturerCannotListItems();
    error BloodTracker__DonationCenterCannotList();
    error BloodTracker__InvalidTokenType();
    error BloodTracker__MustProvidePatientInfo();
    error BloodTracker__MustProvideProductInfo();
    error BloodTracker__AlreadyAdministered();
    error BloodTracker__CannotBuyItems();
    error BloodTracker__DerivativeAlreadyUsedInBatch();
    error BloodTracker__InvalidTokenForAdministration();

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SUPER_ADMIN_ROLE = keccak256("SUPER_ADMIN_ROLE");

    BloodDonation bld;
    BloodDerivative der;
    uint256 constant MINIMUM_DONATION_FEE = 0.001 ether;

    enum Role {
        NO_REGISTERED,      // 0
        DONATION_CENTER,    // 1
        LABORATORY,         // 2
        TRADER,             // 3
        HOSPITAL,           // 4
        MANUFACTURER        // 5
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

    // Administración de pacientes
    struct PatientAdministration {
        uint256 tokenId;
        string patientId;           // Hash del ID del paciente (privacidad)
        string medicalReason;       // Motivo médico
        uint256 timestamp;
        address hospital;
    }

    // Lotes manufacturados
    struct ManufacturedBatch {
        uint256 batchId;
        uint256[] derivativeIds;    // Derivados usados en el lote
        string productType;         // Tipo de producto cosmético
        uint256 timestamp;
        address manufacturer;
    }

    mapping(address donorWallet => Donor) public donors;
    mapping(address companyWallet => Company) public companies;
    mapping(uint256 requestId => RegistrationRequest) public requests;
    mapping(address applicant => uint256 requestId) public activeRequestId;

    // Nuevos mappings para Hospital y Manufacturer
    mapping(uint256 => PatientAdministration) public administeredToPatients;
    mapping(uint256 => ManufacturedBatch) public manufacturedBatches;
    mapping(uint256 => bool) public derivativesUsedInBatch;

    uint256 public requestCounter;
    uint256 public batchCounter;
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

    /**
     * @notice Registra la administración de un derivado o bolsa a un paciente
     * @param tokenId ID del token administrado
     * @param isBloodBag true si es BloodDonation, false si es BloodDerivative
     * @param patientId Hash del ID del paciente (mantiene privacidad)
     * @param medicalReason Motivo médico de la administración
     */
    function registerPatientAdministration(
        uint256 tokenId,
        bool isBloodBag,
        string memory patientId,
        string memory medicalReason
    ) external onlyCompanyRole(Role.HOSPITAL) {
        // Validar parámetros
        if (bytes(patientId).length == 0 || bytes(medicalReason).length == 0) {
            revert BloodTracker__MustProvidePatientInfo();
        }

        // Validar que el hospital posee el token según el tipo
        address owner;
        if (isBloodBag) {
            owner = bld.ownerOf(tokenId);
        } else {
            owner = der.ownerOf(tokenId);
        }

        if (owner != msg.sender) {
            revert BloodTracker__NotOwner();
        }

        // Validar que no se ha administrado antes
        if (administeredToPatients[tokenId].timestamp != 0) {
            revert BloodTracker__AlreadyAdministered();
        }

        // Registrar administración
        administeredToPatients[tokenId] = PatientAdministration({
            tokenId: tokenId,
            patientId: patientId,
            medicalReason: medicalReason,
            timestamp: block.timestamp,
            hospital: msg.sender
        });

        emit PatientAdministered(tokenId, msg.sender, patientId, isBloodBag, block.timestamp);
    }

    /**
     * @notice Crea un lote de producto cosmético usando derivados
     * @param derivativeIds Array de IDs de derivados usados en el lote
     * @param productType Tipo de producto cosmético
     * @dev Los derivados se marcan como usados para evitar reutilización
     */
    function createManufacturedBatch(
        uint256[] memory derivativeIds,
        string memory productType
    ) external onlyCompanyRole(Role.MANUFACTURER) returns (uint256) {
        // Validar que tiene al menos un derivado
        if (derivativeIds.length == 0) {
            revert BloodTracker__MustProvideProductInfo();
        }

        // Validar productType
        if (bytes(productType).length == 0) {
            revert BloodTracker__MustProvideProductInfo();
        }

        // Validar que posee todos los derivados y no están usados
        for (uint256 i = 0; i < derivativeIds.length; i++) {
            // Verificar propiedad
            address owner = der.ownerOf(derivativeIds[i]);
            if (owner != msg.sender) {
                revert BloodTracker__NotOwner();
            }

            // Verificar que no se ha usado antes
            if (derivativesUsedInBatch[derivativeIds[i]]) {
                revert BloodTracker__DerivativeAlreadyUsedInBatch();
            }
        }

        // Incrementar contador
        batchCounter++;

        // Marcar derivados como usados
        for (uint256 i = 0; i < derivativeIds.length; i++) {
            derivativesUsedInBatch[derivativeIds[i]] = true;
        }

        // Crear lote
        manufacturedBatches[batchCounter] = ManufacturedBatch({
            batchId: batchCounter,
            derivativeIds: derivativeIds,
            productType: productType,
            timestamp: block.timestamp,
            manufacturer: msg.sender
        });

        emit BatchCreated(batchCounter, msg.sender, derivativeIds, productType, block.timestamp);

        return batchCounter;
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

        // Validar que el rol puede listar
        if (role == Role.HOSPITAL || role == Role.MANUFACTURER || role == Role.DONATION_CENTER) {
            if (role == Role.HOSPITAL) revert BloodTracker__HospitalCannotListItems();
            if (role == Role.MANUFACTURER) revert BloodTracker__ManufacturerCannotListItems();
            if (role == Role.DONATION_CENTER) revert BloodTracker__DonationCenterCannotList();
        }

        // LABORATORY puede listar ambos tipos
        if (role == Role.LABORATORY) {
            if (nftAddress != address(bld) && nftAddress != address(der)) {
                revert BloodTracker__InvalidTokenType();
            }
            super.listItem(nftAddress, tokenId, price);
            return;
        }

        // TRADER solo puede listar derivados
        if (role == Role.TRADER) {
            if (nftAddress != address(der)) {
                revert BloodTracker__InvalidTokenType();
            }
            super.listItem(nftAddress, tokenId, price);
            return;
        }

        revert BloodTracker__IncorrectRole(role, companies[msg.sender].role);
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) public payable override {
        Role role = companies[msg.sender].role;

        // TRADER puede comprar cualquier cosa
        if (role == Role.TRADER) {
            super.buyItem(nftAddress, tokenId);
            return;
        }

        // HOSPITAL puede comprar bolsas completas (BloodDonation) o derivados
        if (role == Role.HOSPITAL) {
            if (nftAddress != address(bld) && nftAddress != address(der)) {
                revert BloodTracker__InvalidTokenType();
            }
            super.buyItem(nftAddress, tokenId);
            return;
        }

        // MANUFACTURER solo puede comprar derivados
        if (role == Role.MANUFACTURER) {
            if (nftAddress != address(der)) {
                revert BloodTracker__InvalidTokenType();
            }
            super.buyItem(nftAddress, tokenId);
            return;
        }

        // LABORATORY y DONATION_CENTER no pueden comprar
        if (role == Role.LABORATORY || role == Role.DONATION_CENTER) {
            revert BloodTracker__CannotBuyItems();
        }

        // NO_REGISTERED u otros roles no permitidos
        revert BloodTracker__IncorrectRole(role, companies[msg.sender].role);
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
