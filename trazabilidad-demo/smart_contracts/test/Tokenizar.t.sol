// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
//
//
import {Test, console} from "forge-std/Test.sol";
import {Tokenizar} from "../src/Tokenizar.sol";

contract TestTokenizar is Test {
    Tokenizar public tokenizar;

    function setUp() public {
        tokenizar = new Tokenizar();
    }

    function test_createToken() public {
        uint256 tokenId = tokenizar.createToken(
            "Token 1 ",
            100,
            "Features 1",
            0
        );
        assertEq(tokenId, 0);
    }
    function test_getAddressTokens() public {
        
        
        uint256 tokenId = tokenizar.createToken(
            "Token 1 ",
            100,
            "Features 1",
            0
        );

         tokenId = tokenizar.createToken(
            "Token 2 ",
            200,
            "Features 2",
            0
        );
        emit log_named_uint("tokenId", tokenId);
        Tokenizar.TokenSalida[] memory lista = tokenizar.getAddressTokens(
            address(this)
        );
        // emit log_named_uint("lista", lista.length);
        // for (uint256 i = 0; i < lista.length; i++) {
        //     emit log_named_uint("id", lista[i].id);
        //     emit log_named_uint("balance", lista[i].balance);
        //     emit log_named_string("name", lista[i].name);
        //     emit log_named_string("features", lista[i].features);
        //     emit log_named_uint("timestamp", lista[i].timestamp);
        //     emit log_named_uint("parentTokenId", lista[i].parentTokenId);
        //     emit log_named_uint("amount", lista[i].amount);
        // }
        assertEq(lista.length, 2);
    }

    function test_createTransferAndAccept() public {
        uint256 tokenId = tokenizar.createToken(
            "Token 1 ",
            100,
            "Features 1",
            0
        );
        address recipient = address(0x1234567890123456789012345678901234567890);
        uint256 transferId = tokenizar.transferToken(tokenId, recipient, 10);

        vm.prank(0x1234567890123456789012345678901234567890);
        tokenizar.acceptTransfer(transferId);
      
        Tokenizar.TokenSalida[] memory lista = tokenizar.getAddressTokens(recipient);
        emit log_named_uint("lista", lista.length);
        assertEq(lista.length, 1);
    }
       function test_createTransferAndReject() public {
        uint256 tokenId = tokenizar.createToken(
            "Token 1 ",
            100,
            "Features 1",
            0
        );
        address recipient = address(0x1234567890123456789012345678901234567890);
        uint256 transferId = tokenizar.transferToken(tokenId, recipient, 10);

        vm.prank(0x1234567890123456789012345678901234567890);
        tokenizar.rejectTransfer(transferId);
      
        Tokenizar.TokenSalida[] memory lista = tokenizar.getAddressTokens(recipient);
        emit log_named_uint("lista", lista.length);
        assertEq(lista.length, 0);
    }

    function test_getTokenTrace() public {
        uint256 tokenId = tokenizar.createToken(
            "Token 1 ",
            100,
            "Features 1",
            0
        );
        address recipient = address(0x1234567890123456789012345678901234567890);
        uint256 transferId = tokenizar.transferToken(tokenId, recipient, 10);
        vm.prank(recipient);
        tokenizar.acceptTransfer(transferId);   
        vm.prank(address(this));
        recipient = address(0x1234567890123456789012345678901234567890);
        transferId = tokenizar.transferToken(tokenId, recipient, 10);
        vm.prank(recipient);
        tokenizar.acceptTransfer(transferId);   

        Tokenizar.Transfer[] memory trace = tokenizar.getTokenTrace(tokenId);
        emit log_named_uint("trace", trace.length);
        Tokenizar.TokenSalida[] memory tokens = tokenizar.getAddressTokens(recipient);
        emit log_named_uint("tokens", tokens.length);
        assertEq(trace.length, 2);      
    }
}
