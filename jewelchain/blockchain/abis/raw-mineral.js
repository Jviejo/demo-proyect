export const RAW_MINERAL_ABI = [
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "createJewelRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_sc_userJewelChain",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "uniqueId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "requested",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "available",
				"type": "uint256"
			}
		],
		"name": "RawMineral__InsufficientQuantity",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "supplierAddress",
				"type": "address"
			}
		],
		"name": "RawMineral__SupplierIsNotRawMineral",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "uniqueId",
				"type": "bytes32"
			}
		],
		"name": "RawMineral__UniqueIdNotFound",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "RawMineral__UserInvalidAddress",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "RawMineral__UserNotAuthorized",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "supplier",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "uniqueId",
				"type": "bytes32"
			}
		],
		"name": "JewelChain_NewOrder",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "supplier",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "distributor",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "trackingId",
				"type": "bytes32"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "supplier",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "uniqueId",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "name",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "enum IJewelChain.RecordType",
						"name": "recordType",
						"type": "uint8"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					}
				],
				"indexed": false,
				"internalType": "struct IJewelChain.JewelRecord",
				"name": "jewelRecord",
				"type": "tuple"
			}
		],
		"name": "JewelChain_Recieve",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "supplier",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "uniqueId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "enum IJewelChain.RecordType",
				"name": "recordType",
				"type": "uint8"
			}
		],
		"name": "JewelChain__Created",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "supplier",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "uniqueId",
				"type": "bytes32"
			}
		],
		"name": "JewelChain__SendNewOrder",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "supplier",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "uniqueId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "requestedQuantity",
				"type": "uint256"
			}
		],
		"name": "orderMaterial",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "distributor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "supplier",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "trackingId",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "jewels",
				"type": "bytes"
			}
		],
		"name": "recieveMaterial",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "uniqueId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "indexOrder",
				"type": "uint256"
			}
		],
		"name": "sendMaterial",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_sc_Distributor",
				"type": "address"
			}
		],
		"name": "setDistributorSC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
		"inputs": [
			{
				"internalType": "bytes",
				"name": "encodedData",
				"type": "bytes"
			}
		],
		"name": "decodeJewel",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "supplier",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "uniqueId",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "name",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "enum IJewelChain.RecordType",
						"name": "recordType",
						"type": "uint8"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					}
				],
				"internalType": "struct IJewelChain.JewelRecord",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "pure",
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
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "uniqueId",
				"type": "bytes32"
			}
		],
		"name": "encodeJewel",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "uniqueId",
				"type": "bytes32"
			}
		],
		"name": "getJewelByUniqueId",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "supplier",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "uniqueId",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "name",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "enum IJewelChain.RecordType",
						"name": "recordType",
						"type": "uint8"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					}
				],
				"internalType": "struct IJewelChain.JewelRecord",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "supplier",
				"type": "address"
			}
		],
		"name": "getJewelRecordBySupplier",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "supplier",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "uniqueId",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "name",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "enum IJewelChain.RecordType",
						"name": "recordType",
						"type": "uint8"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					}
				],
				"internalType": "struct IJewelChain.JewelRecord[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOrderMaterialList",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "uniqueId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					}
				],
				"internalType": "struct IJewelChain.JewelToSend[]",
				"name": "",
				"type": "tuple[]"
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
	}
];