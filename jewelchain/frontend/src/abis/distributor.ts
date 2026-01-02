export const DISTRIBUTOR_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_rawMineral",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_userJewelChain",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "Distributor__ReceiverNotFound",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "trackingId",
				"type": "bytes32"
			}
		],
		"name": "Distributor__TrackingIdNotFound",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "Distributor__UserInvalidAddress",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "Distributor__UserNotAuthorized",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "trackingId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "distributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "shipper",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "trackingId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "shipperDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deliveryDate",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "jewelChain",
						"type": "bytes"
					}
				],
				"indexed": false,
				"internalType": "struct IDistributor.Delivery",
				"name": "delivery",
				"type": "tuple"
			}
		],
		"name": "Distributor__Delivery",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "trackingId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "shipper",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "shipper",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "trackingId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "shipperDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deliveryDate",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "jewelChain",
						"type": "bytes"
					}
				],
				"indexed": false,
				"internalType": "struct IDistributor.Delivery",
				"name": "delivery",
				"type": "tuple"
			}
		],
		"name": "Distributor__Shipment",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DISTRIBUTOR_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "JEWEL_FACTORY_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "RAW_MINERAL_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "STORE_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "trackingId",
				"type": "bytes32"
			}
		],
		"name": "confirmDelivery",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "trackingId",
				"type": "bytes32"
			}
		],
		"name": "getShipmentByTrackingId",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "shipper",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "trackingId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "shipperDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deliveryDate",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "jewelChain",
						"type": "bytes"
					}
				],
				"internalType": "struct IDistributor.Delivery",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getShipments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "shipper",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "trackingId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "shipperDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deliveryDate",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "jewelChain",
						"type": "bytes"
					}
				],
				"internalType": "struct IDistributor.Delivery[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "shipper",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "jewelChain",
				"type": "bytes"
			}
		],
		"name": "newShipment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_jewelFactory",
				"type": "address"
			}
		],
		"name": "setJewelFactoryAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];