// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

/**
 * @title IJewelChain es la interfaz general para todos aquellos roles relacionados con la trazabilidad, como minerales, joyas
 * @author Johan Sebastian y Pau
 */
interface IJewelChain {
    // Enum
    enum RecordType {
        MATERIAL,
        JEWEL
    }

    // Struct
    struct JewelRecord {
        address supplier;
        bytes32 uniqueId;
        bytes32 name;
        uint256 date;
        uint256 quantity;
        RecordType recordType;
        bytes data;
    }

    struct JewelToSend {
        address to;
        bytes32 uniqueId;
        uint256 index;
        uint256 quantity;
    }

    // Errors
    error RawMineral__UserInvalidAddress(address userAddress);
    error RawMineral__UserNotAuthorized(address userAddress);
    error RawMineral__SupplierIsNotRawMineral(address supplierAddress);
    error RawMineral__UniqueIdNotFound(bytes32 uniqueId);

    /**
     * @dev Evento para la creación de un nuevo registro de trazabilidad.
     * Sigue el formato NombreClase__NombreEvento para su organización.
     * @param supplier Dirección del proveedor o fabricante.
     * @param uniqueId Identificador único del registro.
     * @param name Nombre del material o joya.
     * @param date Fecha asociada al evento (extracción o fabricación).
     * @param quantity Cantidad del material o joya.
     * @param data Datos adicionales específicos del registro.
     * @param recordType Tipo de registro (MATERIAL o JEWEL).
     */
    event JewelChain__Created(
        address indexed supplier,
        bytes32 indexed uniqueId,
        bytes32 name,
        uint256 date,
        uint256 quantity,
        bytes data,
        RecordType recordType
    );

    event JewelChain_Recieve(
        address indexed supplier, address indexed distributor, bytes32 indexed trackingId, JewelRecord jewelRecord
    );

    event JewelChain_NewOrder(address indexed supplier, address indexed receiver, bytes32 indexed uniqueId);

    event JewelChain__SendNewOrder(address indexed supplier, address indexed receiver, bytes32 indexed uniqueId);

    /**
     * @dev Función para crear un nuevo registro de trazabilidad.
     * @param name Nombre del material o joya.
     * @param date Fecha asociada al evento (extracción o fabricación).
     * @param quantity Cantidad del material o joya.
     * @param data Datos adicionales específicos del registro.
     */
    function createJewelRecord(bytes32 name, uint256 date, uint256 quantity, bytes calldata data) external;

    /**
     * @dev Función para obtener los registros de trazabilidad asociados a un proveedor.
     * @param supplier Dirección del proveedor del cual se desean consultar los registros.
     * @return Array de registros de trazabilidad `JewelRecord`.
     */
    function getJewelRecordBySupplier(address supplier) external view returns (JewelRecord[] memory);

    /**
     * @param jewels Array de registros de trazabilidad `JewelRecord`.
     */
    function recieveMaterial(address distributor, address suplier, bytes32 trackingId, bytes calldata jewels)
        external;

    /**
     * @dev Función para ordenar un material.
     * @param supplier Dirección del proveedor del cual se desean consultar los registros.
     * @param uniqueId id de una joya o mineral.
     */
    function orderMaterial(address supplier, bytes32 uniqueId, uint256 requestedQuantity) external;

    /**
     * @dev funcion que recupera todos los materiales de un supplier
     */
    function getOrderMaterialList() external view returns (JewelToSend[] memory);

    function sendMaterial(bytes32 uniqueId, uint256 indexOrder) external;

    function getJewelByUniqueId(bytes32 uniqueId) external returns (JewelRecord memory);
}
