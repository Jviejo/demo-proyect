// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {Test, console} from "forge-std/Test.sol";
import {IUserJewelChain} from "./../src/user/IUserJewelChain.sol";
import {UserJewelChain} from "./../src/user/UserJewelChain.sol";
import {UserConstant} from "./../src/user/UserConstant.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract UserJewelChainTest is Test, UserConstant {
    UserJewelChain public userJewelChain;
    address private USER = address(0x123);
    bytes32 private JEWEL_FACTORY_ROLE_TEST = JEWEL_FACTORY_ROLE;

    error UsersJewelsChain__UserNotFound(address);

    function setUp() public {
        userJewelChain = new UserJewelChain();
    }

    function test_CreateUser() public {
        vm.expectEmit(true, true, false, false);
        emit IUserJewelChain.UsersJewelsChain__UserCreated(USER, JEWEL_FACTORY_ROLE_TEST, true);
        userJewelChain.createUser(USER, JEWEL_FACTORY_ROLE_TEST, "John Doe");

        IUserJewelChain.User memory userCreated = userJewelChain.getUser(USER);
        assertEq(userCreated.user, USER);
        assertEq(userCreated.role, JEWEL_FACTORY_ROLE_TEST);
        assertEq(userCreated.isActive, true);
        assertEq(userCreated.name, "John Doe");
    }

    function test_CreateUserThatExist() public {
        vm.expectEmit(true, true, false, false);
        emit IUserJewelChain.UsersJewelsChain__UserCreated(USER, JEWEL_FACTORY_ROLE_TEST, true);
        userJewelChain.createUser(USER, JEWEL_FACTORY_ROLE_TEST, "John Doe");

        vm.expectRevert(abi.encodeWithSelector(IUserJewelChain.UsersJewelsChain__UserExisted.selector, USER));
        userJewelChain.createUser(USER, JEWEL_FACTORY_ROLE_TEST, "John Doe");
    }

    function test_CreateUserWithNotExistRole() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IUserJewelChain.UsersJewelsChain__UserInvalidRole.selector, USER, keccak256("FALSE_ROLE")
            )
        );
        userJewelChain.createUser(USER, keccak256("FALSE_ROLE"), "John Doe");
    }

    function test_UpdateUser() public {
        userJewelChain.createUser(USER, JEWEL_FACTORY_ROLE_TEST, "John Doe");

        vm.expectEmit(true, true, false, false);
        emit IUserJewelChain.UsersJewelsChain__UserUpdatedStatus(USER, false);
        userJewelChain.updateStatusUser(USER, false);

        IUserJewelChain.User memory userCreated = userJewelChain.getUser(USER);
        assertEq(userCreated.user, USER);
        assertEq(userCreated.role, JEWEL_FACTORY_ROLE_TEST);
        assertEq(userCreated.isActive, false);
    }

    function test_UpdateUserThatNotExist() public {
        vm.expectRevert(abi.encodeWithSelector(IUserJewelChain.UsersJewelsChain__UserNotFound.selector, USER));
        userJewelChain.updateStatusUser(USER, false);
    }

    function test_UpdateUserSameStatus() public {
        userJewelChain.createUser(USER, JEWEL_FACTORY_ROLE_TEST, "John Doe");
        vm.expectRevert(
            abi.encodeWithSelector(IUserJewelChain.UsersJewelsChain__UserHasSameStatus.selector, USER, true)
        );
        userJewelChain.updateStatusUser(USER, true);
    }

    function test_DeleteUser() public {
        userJewelChain.createUser(USER, JEWEL_FACTORY_ROLE_TEST, "John Doe");
        vm.expectEmit(true, true, false, false);
        emit IUserJewelChain.UsersJewelsChain__UserDeleted(USER);

        userJewelChain.deleteUser(USER);
    }

    function test_DeleteUserThatNotExist() public {
        vm.expectRevert(abi.encodeWithSelector(UsersJewelsChain__UserNotFound.selector, USER));
        userJewelChain.deleteUser(USER);
    }

    function test_OnlyAdminCanCall() public {
        vm.startPrank(USER);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, USER));
        userJewelChain.createUser(USER, JEWEL_FACTORY_ROLE_TEST, "John Doe");
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, USER));
        userJewelChain.updateStatusUser(USER, false);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, USER));
        userJewelChain.deleteUser(USER);
        vm.stopPrank();
    }
}
