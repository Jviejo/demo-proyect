// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {RawMineral} from "./../jewel-chain/RawMineral.sol";
import {IJewelChain} from "./../jewel-chain/IJewelChain.sol";
import {UserJewelChain} from "./../user/UserJewelChain.sol";
import {UserConstant} from "./../user/UserConstant.sol";
import {IDistributor} from "./IDistributor.sol";
import {JewelFactory} from "./../jewel-chain/JewelFactory.sol";

contract Distributor is IDistributor, UserConstant {
    mapping(bytes32 => uint256) private deliveriesPending;
    Delivery[] private deliveries;

    RawMineral private sc_rawMineral;
    UserJewelChain private sc_userJewelChain;
    JewelFactory private sc_jewelFactory;

    modifier checkRoleUser(bytes32 _role) {
        if (!sc_userJewelChain.checkUserRole(msg.sender, _role)) {
            revert Distributor__UserNotAuthorized(msg.sender);
        }
        _;
    }

    modifier checkAddresZero() {
        if (msg.sender == address(0)) {
            revert Distributor__UserInvalidAddress(msg.sender);
        }
        _;
    }

    modifier checkTrackingId(bytes32 trackingId) {
        if (deliveriesPending[trackingId] == 0) {
            revert Distributor__TrackingIdNotFound(trackingId);
        }
        _;
    }

    constructor(address _rawMineral, address _userJewelChain) {
        sc_rawMineral = RawMineral(_rawMineral);
        sc_userJewelChain = UserJewelChain(_userJewelChain);
    }

    function setJewelFactoryAddress(address _jewelFactory) external checkRoleUser(UserConstant.ADMIN_ROLE) {
        sc_jewelFactory = JewelFactory(_jewelFactory);
    }

    /**
     * @notice
     * @param shipper address who send the jewels
     * @param receiver address who send the jewels
     * @param jewelChain array of jewels to deliver
     */
    function newShipment(address shipper, address receiver, bytes calldata jewelChain)
        external
        override
        checkAddresZero
    {
        if (
            !sc_userJewelChain.checkUserRole(shipper, UserConstant.RAW_MINERAL_ROLE)
                && !sc_userJewelChain.checkUserRole(shipper, UserConstant.JEWEL_FACTORY_ROLE)
        ) {
            revert Distributor__UserNotAuthorized(shipper);
        }

        uint256 date = block.timestamp;

        bytes32 trackingId = keccak256(abi.encodePacked(shipper, date));

        Delivery memory delivery = Delivery({
            shipper: shipper,
            receiver: receiver,
            trackingId: trackingId,
            shipperDate: date,
            deliveryDate: 0,
            jewelChain: jewelChain
        });
        deliveries.push(delivery);
        deliveriesPending[trackingId] = deliveries.length;
        emit Distributor__Shipment(trackingId, shipper, receiver, delivery.shipperDate, delivery);
    }

    /**
     * @param trackingId bytes32 of the shipment
     */
    function confirmDelivery(bytes32 trackingId)
        external
        override
        checkRoleUser(UserConstant.DISTRIBUTOR_ROLE)
        checkTrackingId(trackingId)
    {
        uint256 index = deliveriesPending[trackingId];

        Delivery memory delivery = deliveries[index - 1];
        delivery.deliveryDate = block.timestamp;

        address receiver = delivery.receiver;

        sendJewels(delivery.jewelChain, receiver, trackingId);
        if (deliveries.length != index) {
            deliveries[index - 1] = deliveries[deliveries.length - 1];
            bytes32 trackingIdLast = deliveries[deliveries.length - 1].trackingId;
            deliveriesPending[trackingIdLast] = index;
        }
        deliveries.pop();

        delete deliveriesPending[trackingId];
        emit Distributor__Delivery(trackingId, delivery.receiver, msg.sender, delivery.deliveryDate, delivery);
    }

    function sendJewels(bytes memory jewelRecord, address receiver, bytes32 trackingId) private {
        bytes32 _roleUserDelivery = sc_userJewelChain.getRoleUser(receiver);
        if (_roleUserDelivery == UserConstant.RAW_MINERAL_ROLE) {
            sc_rawMineral.recieveMaterial(msg.sender, receiver, trackingId, jewelRecord);
        } else if (_roleUserDelivery == UserConstant.JEWEL_FACTORY_ROLE) {
            IJewelChain.JewelRecord memory record = sc_rawMineral.decodeJewel(jewelRecord);
            sc_jewelFactory.receiveMaterial(record.supplier, record.uniqueId, record.quantity, trackingId, record);
        } else if (_roleUserDelivery == UserConstant.STORE_ROLE) {
            revert("Method not implemented");
        } else {
            revert Distributor__ReceiverNotFound(receiver, _roleUserDelivery);
        }
    }

    function getShipmentByTrackingId(bytes32 trackingId)
        external
        view
        override
        checkRoleUser(UserConstant.DISTRIBUTOR_ROLE)
        checkTrackingId(trackingId)
        returns (Delivery memory)
    {
        uint256 index = deliveriesPending[trackingId];
        return deliveries[index - 1];
    }

    function getShipments()
        external
        view
        override
        checkRoleUser(UserConstant.DISTRIBUTOR_ROLE)
        returns (Delivery[] memory)
    {
        return deliveries;
    }
}
