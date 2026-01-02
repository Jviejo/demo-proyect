// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
//
//
import {Test, console} from "forge-std/Test.sol";
import {SupplyChainRoles} from "../src/SupplyChainRoles.sol";

contract TestSupplyChainRoles is Test {
    address public constant OWNER_ADDRESS =  0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;
    address public constant FARMER_ADDRESS =  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address public constant FACTORY_ADDRESS =  0x70997970C51812dc3A010C7d01b50e0d17dc79C8; 
    address public constant RETAILER_ADDRESS =  0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; 
    address public constant CONSUMER_ADDRESS =  0x90F79bf6EB2c4f870365E785982E1f101E93b906;

    SupplyChainRoles public supplyChain;

    function setUp() public {
        vm.prank(OWNER_ADDRESS);
        
        supplyChain = new SupplyChainRoles();
       
    }

    function test_Increment() public {
        vm.prank(OWNER_ADDRESS);

        supplyChain.assignRole(FARMER_ADDRESS, SupplyChainRoles.Role.Farmer);
        supplyChain.assignRole(FACTORY_ADDRESS, SupplyChainRoles.Role.Factory);
        supplyChain.assignRole(RETAILER_ADDRESS, SupplyChainRoles.Role.Retailer);
        supplyChain.assignRole(CONSUMER_ADDRESS, SupplyChainRoles.Role.Consumer);

        vm.prank(FARMER_ADDRESS);
        // Add amounts
        supplyChain.addAmount(FARMER_ADDRESS, "Coffee Beans", 1000);

        vm.prank(FARMER_ADDRESS);
        // // Transfer
        // // Farmer to Factory
        supplyChain.transfer(FACTORY_ADDRESS, "Coffee Beans", 500);
        console.log("Transferred");
        // // Get balances
        SupplyChainRoles.Balance memory farmerBalance = supplyChain.getBalanceByAddress(FARMER_ADDRESS);
        console.log("Farmer Balance: %s", farmerBalance.products[0].balance);
        // // Get transfers
        SupplyChainRoles.Transfer[] memory sentTransfers = supplyChain.getTransferByAddressFrom(FARMER_ADDRESS);
        console.log("Sent Transfers: %s", sentTransfers.length);


        SupplyChainRoles.Transfer[] memory receivedTransfers = supplyChain.getTransferByAddressTo(FACTORY_ADDRESS);
        console.log("Received Transfers: %s", receivedTransfers.length);

        // // Get all participants
        (address[] memory addresses, SupplyChainRoles.Role[] memory roles) = supplyChain.getAllParticipants();
        console.log("Addresses: %s", addresses.length);
        console.log("Roles: %s", roles.length);

        // Enumerate all participants
        for (uint i = 0; i < addresses.length; i++) {
            console.log("Participant %s: %s, Role: %s", i, addresses[i], uint(roles[i]));
        }



        // Enumerate all balances
        for (uint i = 0; i < addresses.length; i++) {
            SupplyChainRoles.Balance memory balance = supplyChain.getBalanceByAddress(addresses[i]);
            console.log("Balance for %s:", addresses[i]);
            for (uint j = 0; j < balance.products.length; j++) {
                console.log("  Product: %s, Amount: %s",  balance.products[j].name, balance.products[j].balance);
            }
        }
        
        // Enumerate all transfers
        console.log("\nAll Transfers:");
        SupplyChainRoles.Transfer[] memory allTransfers = supplyChain.getAllTransfers();
        for (uint i = 0; i < allTransfers.length; i++) {
            console.log("Transfer %s:", i);
            console.log("  From: %s", allTransfers[i].from);
            console.log("  To: %s", allTransfers[i].to);
            console.log("  Product: %s", allTransfers[i].product);
            console.log("  Amount: %s", allTransfers[i].amount);
            console.log("  Timestamp: %s", allTransfers[i].timestamp);
            console.log("  status: %s", uint(allTransfers[i].status));
        }
    }

    
}
