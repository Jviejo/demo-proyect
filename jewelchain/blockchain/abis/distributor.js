export const DISTRIBUTOR_ABI = [
    {
        type: "constructor",
        inputs: [
            {
                name: "_rawMineral",
                type: "address",
                internalType: "address",
            },
            {
                name: "_userJewelChain",
                type: "address",
                internalType: "address",
            },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "ADMIN_ROLE",
        inputs: [],
        outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "DISTRIBUTOR_ROLE",
        inputs: [],
        outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "JEWEL_FACTORY_ROLE",
        inputs: [],
        outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "RAW_MINERAL_ROLE",
        inputs: [],
        outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "STORE_ROLE",
        inputs: [],
        outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "confirmDelivery",
        inputs: [
            {
                name: "trackingId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "getShipmentByTrackingId",
        inputs: [
            {
                name: "trackingId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "tuple",
                internalType: "struct IDistributor.Delivery",
                components: [
                    {
                        name: "shipper",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "receiver",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "trackingId",
                        type: "bytes32",
                        internalType: "bytes32",
                    },
                    {
                        name: "shipperDate",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "deliveryDate",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "jewelChain",
                        type: "bytes",
                        internalType: "bytes",
                    },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getShipments",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "tuple[]",
                internalType: "struct IDistributor.Delivery[]",
                components: [
                    {
                        name: "shipper",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "receiver",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "trackingId",
                        type: "bytes32",
                        internalType: "bytes32",
                    },
                    {
                        name: "shipperDate",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "deliveryDate",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "jewelChain",
                        type: "bytes",
                        internalType: "bytes",
                    },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "newShipment",
        inputs: [
            {
                name: "shipper",
                type: "address",
                internalType: "address",
            },
            {
                name: "receiver",
                type: "address",
                internalType: "address",
            },
            {
                name: "jewelChain",
                type: "bytes",
                internalType: "bytes",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "event",
        name: "Distributor__Delivery",
        inputs: [
            {
                name: "trackingId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "receiver",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "distributor",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "date",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
            {
                name: "delivery",
                type: "tuple",
                indexed: false,
                internalType: "struct IDistributor.Delivery",
                components: [
                    {
                        name: "shipper",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "receiver",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "trackingId",
                        type: "bytes32",
                        internalType: "bytes32",
                    },
                    {
                        name: "shipperDate",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "deliveryDate",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "jewelChain",
                        type: "bytes",
                        internalType: "bytes",
                    },
                ],
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "Distributor__Shipment",
        inputs: [
            {
                name: "trackingId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
            },
            {
                name: "shipper",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "receiver",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "date",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
            {
                name: "delivery",
                type: "tuple",
                indexed: false,
                internalType: "struct IDistributor.Delivery",
                components: [
                    {
                        name: "shipper",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "receiver",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "trackingId",
                        type: "bytes32",
                        internalType: "bytes32",
                    },
                    {
                        name: "shipperDate",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "deliveryDate",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "jewelChain",
                        type: "bytes",
                        internalType: "bytes",
                    },
                ],
            },
        ],
        anonymous: false,
    },
    {
        type: "error",
        name: "Distributor__ReceiverNotFound",
        inputs: [
            {
                name: "receiver",
                type: "address",
                internalType: "address",
            },
            { name: "role", type: "bytes32", internalType: "bytes32" },
        ],
    },
    {
        type: "error",
        name: "Distributor__TrackingIdNotFound",
        inputs: [
            {
                name: "trackingId",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
    },
    {
        type: "error",
        name: "Distributor__UserInvalidAddress",
        inputs: [{ name: "user", type: "address", internalType: "address" }],
    },
    {
        type: "error",
        name: "Distributor__UserNotAuthorized",
        inputs: [{ name: "user", type: "address", internalType: "address" }],
    },
];
