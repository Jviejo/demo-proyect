// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {UserConstant} from "./../user/UserConstant.sol";
import {UserJewelChain} from "./../user/UserJewelChain.sol";
import {RawMineral} from "./RawMineral.sol";
import {IJewelChain} from "./IJewelChain.sol";
import {Distributor} from "./../distributor/Distributor.sol";

contract JewelFactory is ERC1155, ERC1155Burnable, ERC1155Supply, UserConstant {
    // Estructuras
    struct MaterialRequirement {
        bytes32 materialId;
        uint256 quantity;
    }

    struct JewelMetadata {
        bytes32 name;
        uint256 creationDate;
        address creator;
        MaterialRequirement[] materials; // Materiales y cantidades usadas
        bytes data; // Datos adicionales (calidad, certificaciones, etc.)
    }

    // Nueva estructura para el inventario de materiales
    struct MaterialInventory {
        bytes32 materialId;
        uint256 quantity;
        address supplier;
    }

    struct MaterialReceipt {
        address supplier;
        bytes32 materialId;
        uint256 quantity;
        uint256 receiptDate;
        bytes32 trackingId;
        IJewelChain.JewelRecord originalMaterial; // Mantiene todos los datos originales del material
    }

    // Mappings
    mapping(uint256 => JewelMetadata) private _jewelMetadata;
    mapping(uint256 => address[]) private _ownershipHistory;

    // Nuevo mapping para el inventario de materiales
    mapping(bytes32 => MaterialInventory) private _materialInventory;

    // Modificar el mapping para incluir toda la información
    mapping(bytes32 => MaterialReceipt) private _materialReceipts;

    // Variables de estado
    UserJewelChain private sc_userJewelChain;
    RawMineral private sc_rawMineral;
    Distributor private sc_distributor;
    uint256 private _nextTokenId;

    // Eventos
    event JewelCreated(
        uint256 indexed tokenId,
        address indexed creator,
        bytes32 name,
        MaterialRequirement[] materials,
        uint256 creationDate,
        bytes data
    );

    event MaterialConsumed(
        bytes32 indexed materialId, uint256 indexed tokenId, uint256 requestedQuantity, uint256 availableQuantity
    );

    event MaterialReceived(
        bytes32 indexed materialId, uint256 quantity, address supplier, uint256 receiptDate, bytes32 trackingId
    );

    // Nuevo evento para emitir cuando se actualice el inventario
    event MaterialInventoryUpdated(bytes32 indexed materialId, uint256 quantity, address supplier);

    // Error personalizado
    error JewelFactory__InsufficientMaterialBalance(bytes32 materialId, uint256 requested, uint256 available);

    // Añadir un array para trackear los materialIds
    bytes32[] private _materialIds;

    // Modificadores
    modifier onlyJewelFactory() {
        if (!sc_userJewelChain.checkUserRole(msg.sender, JEWEL_FACTORY_ROLE)) {
            revert("JewelFactory: caller is not a jewel factory");
        }
        _;
    }

    constructor(address _userJewelChain, address _rawMineral, address _distributor, string memory baseUri)
        ERC1155(baseUri)
    {
        sc_userJewelChain = UserJewelChain(_userJewelChain);
        sc_rawMineral = RawMineral(_rawMineral);
        sc_distributor = Distributor(_distributor);
        _nextTokenId = 1;
    }

    // Función modificada para recibir materiales
    function receiveMaterial(
        address supplier,
        bytes32 materialId,
        uint256 quantity,
        bytes32 trackingId,
        IJewelChain.JewelRecord calldata originalMaterial
    ) external {
        // Solo el Distributor puede entregar materiales
        require(msg.sender == address(sc_distributor), "JewelFactory: caller is not the distributor");

        // Si es la primera vez que recibimos este material, añadirlo al array
        if (_materialInventory[materialId].quantity == 0) {
            _materialIds.push(materialId);
        }

        _materialInventory[materialId].materialId = materialId;
        _materialInventory[materialId].quantity += quantity;
        _materialInventory[materialId].supplier = supplier;

        // Guardar el recibo completo
        _materialReceipts[materialId] = MaterialReceipt({
            supplier: supplier,
            materialId: materialId,
            quantity: quantity,
            receiptDate: block.timestamp,
            trackingId: trackingId,
            originalMaterial: originalMaterial
        });

        emit MaterialReceived(materialId, quantity, supplier, block.timestamp, trackingId);
    }

    // Función modificada para crear joyas
    function createJewel(bytes32 name, uint256 quantity, MaterialRequirement[] calldata materials, bytes calldata data)
        external
        onlyJewelFactory
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;

        // Verificar y consumir materias primas del inventario
        MaterialRequirement[] storage jewelMaterials = _jewelMetadata[tokenId].materials;

        for (uint256 i = 0; i < materials.length; i++) {
            MaterialInventory storage inventory = _materialInventory[materials[i].materialId];

            // Verificar que hay suficiente material en inventario
            if (inventory.quantity < materials[i].quantity) {
                revert JewelFactory__InsufficientMaterialBalance(
                    materials[i].materialId, materials[i].quantity, inventory.quantity
                );
            }

            // Consumir material del inventario
            inventory.quantity -= materials[i].quantity;

            // Registrar material usado
            jewelMaterials.push(
                MaterialRequirement({materialId: materials[i].materialId, quantity: materials[i].quantity})
            );

            emit MaterialConsumed(materials[i].materialId, tokenId, materials[i].quantity, inventory.quantity);
        }

        // Crear metadata de la joya
        _jewelMetadata[tokenId].name = name;
        _jewelMetadata[tokenId].creationDate = block.timestamp;
        _jewelMetadata[tokenId].creator = msg.sender;
        _jewelMetadata[tokenId].data = data;

        // Inicializar historial de propiedad
        _ownershipHistory[tokenId].push(msg.sender);

        // Mintear tokens ERC1155
        _mint(msg.sender, tokenId, quantity, "");

        emit JewelCreated(tokenId, msg.sender, name, materials, block.timestamp, data);

        return tokenId;
    }

    function getJewelMetadata(uint256 tokenId) external view returns (JewelMetadata memory) {
        return _jewelMetadata[tokenId];
    }

    function getOwnershipHistory(uint256 tokenId) external view returns (address[] memory) {
        return _ownershipHistory[tokenId];
    }

    // Nueva función para consultar el inventario de materiales
    function getMaterialInventory(bytes32 materialId) external view returns (MaterialInventory memory) {
        return _materialInventory[materialId];
    }

    // Nueva función para consultar el recibo de un material
    function getMaterialReceipt(bytes32 materialId) external view returns (MaterialReceipt memory) {
        return _materialReceipts[materialId];
    }

    // Reemplazar _beforeTokenTransfer por _update
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        virtual
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);

        // Actualizar historial solo para transferencias (no mint/burn)
        if (from != address(0) && to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                _ownershipHistory[ids[i]].push(to);
            }
        }
    }

    // Función modificada para obtener el inventario
    function getAllMaterialsInventory() external view returns (bytes32[] memory, MaterialInventory[] memory) {
        uint256 activeCount = 0;

        // Primero contamos cuántos materiales tienen cantidad > 0
        for (uint256 i = 0; i < _materialIds.length; i++) {
            if (_materialInventory[_materialIds[i]].quantity > 0) {
                activeCount++;
            }
        }

        // Crear arrays del tamaño exacto necesario
        bytes32[] memory activeIds = new bytes32[](activeCount);
        MaterialInventory[] memory activeInventories = new MaterialInventory[](activeCount);

        // Llenar los arrays solo con materiales activos
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < _materialIds.length; i++) {
            bytes32 materialId = _materialIds[i];
            if (_materialInventory[materialId].quantity > 0) {
                activeIds[currentIndex] = materialId;
                activeInventories[currentIndex] = _materialInventory[materialId];
                currentIndex++;
            }
        }

        return (activeIds, activeInventories);
    }

    // Nueva estructura para devolver toda la información de una joya
    struct JewelComplete {
        uint256 tokenId;
        bytes32 name;
        uint256 creationDate;
        address creator;
        MaterialRequirement[] materials;
        bytes data;
        address[] ownershipHistory;
        uint256 totalSupply;
    }

    // Nueva función para obtener todas las joyas
    function getAllJewels() external view returns (JewelComplete[] memory) {
        uint256 totalJewels = _nextTokenId - 1;
        JewelComplete[] memory jewels = new JewelComplete[](totalJewels);

        for (uint256 i = 1; i <= totalJewels; i++) {
            if (exists(i)) {
                // Verificar si el token existe
                JewelMetadata storage metadata = _jewelMetadata[i];
                jewels[i - 1] = JewelComplete({
                    tokenId: i,
                    name: metadata.name,
                    creationDate: metadata.creationDate,
                    creator: metadata.creator,
                    materials: metadata.materials,
                    data: metadata.data,
                    ownershipHistory: _ownershipHistory[i],
                    totalSupply: totalSupply(i)
                });
            }
        }

        return jewels;
    }
}
