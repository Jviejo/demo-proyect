// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

interface IDistributor {
    struct Delivery {
        address shipper;
        address receiver;
        bytes32 trackingId;
        uint256 shipperDate;
        uint256 deliveryDate;
        bytes jewelChain;
    }

    error Distributor__UserNotAuthorized(address user);
    error Distributor__UserInvalidAddress(address user);
    error Distributor__TrackingIdNotFound(bytes32 trackingId);
    error Distributor__ReceiverNotFound(address receiver, bytes32 role);

    event Distributor__Shipment(
        bytes32 indexed trackingId, address indexed shipper, address indexed receiver, uint256 date, Delivery delivery
    );
    event Distributor__Delivery(
        bytes32 indexed trackingId,
        address indexed receiver,
        address indexed distributor,
        uint256 date,
        Delivery delivery
    );

    function newShipment(address shipper, address receiver, bytes calldata jewelChain) external;

    function confirmDelivery(bytes32 trackingId) external;

    function getShipmentByTrackingId(bytes32 trackingId) external view returns (Delivery memory);
    function getShipments() external view returns (Delivery[] memory);
}
