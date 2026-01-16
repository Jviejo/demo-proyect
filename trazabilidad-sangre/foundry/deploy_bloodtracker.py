#!/usr/bin/env python3
"""
Deploy BloodTracker contract using direct RPC calls
This avoids the argument length limit in Windows
"""

import json
import requests

RPC_URL = "http://localhost:8545"
PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
FROM_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

# Read the bytecode with constructor args
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
bytecode_path = os.path.join(script_dir, 'bt.hex')
with open(bytecode_path, 'r') as f:
    bytecode = f.read().strip()

# Ensure it starts with 0x
if not bytecode.startswith('0x'):
    bytecode = '0x' + bytecode

print(f"Deploying BloodTracker...")
print(f"Bytecode length: {len(bytecode)} characters")
print("")

# Send the transaction
payload = {
    "jsonrpc": "2.0",
    "method": "eth_sendTransaction",
    "params": [{
        "from": FROM_ADDRESS,
        "data": bytecode,
        "gas": "0x989680"  # 10000000 in hex
    }],
    "id": 1
}

response = requests.post(RPC_URL, json=payload)
result = response.json()

if 'error' in result:
    print(f"Error: {result['error']}")
    exit(1)

tx_hash = result['result']
print(f"Transaction hash: {tx_hash}")
print("")

# Wait for receipt
print("Waiting for transaction receipt...")
receipt_payload = {
    "jsonrpc": "2.0",
    "method": "eth_getTransactionReceipt",
    "params": [tx_hash],
    "id": 2
}

import time
for i in range(30):
    time.sleep(1)
    response = requests.post(RPC_URL, json=receipt_payload)
    result = response.json()

    if result.get('result'):
        receipt = result['result']
        contract_address = receipt.get('contractAddress')
        status = receipt.get('status')

        print(f"✓ Transaction mined!")
        print(f"  Block number: {int(receipt.get('blockNumber', '0x0'), 16)}")
        print(f"  Contract address: {contract_address}")
        print(f"  Gas used: {int(receipt.get('gasUsed', '0x0'), 16)}")
        print(f"  Status: {'SUCCESS' if status == '0x1' else 'FAILED'}")
        exit(0 if status == '0x1' else 1)

print("Timeout waiting for receipt")
exit(1)
