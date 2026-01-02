// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {UserConstant} from "./UserConstant.sol";
import {IUserJewelChain} from "./IUserJewelChain.sol";

contract UserJewelChain is IUserJewelChain, Ownable, AccessControl, UserConstant {
    mapping(address => uint256) private _usersMapping;
    User[] private _usersArray;
    mapping(bytes32 => bool) private _allowedRoles;

    /**
     * Modifiers
     */
    modifier checkIfUserExist(address _userAddress) {
        if (_usersMapping[_userAddress] == 0) {
            revert UsersJewelsChain__UserNotFound(_userAddress);
        }
        _;
    }

    modifier checkIfZerroAddress(address _userAddress) {
        if (_userAddress == address(0)) {
            revert UsersJewelsChain__UserInvalidAddress(_userAddress);
        }
        _;
    }

    constructor() Ownable(msg.sender) {
        _allowedRoles[ADMIN_ROLE] = true;
        _allowedRoles[RAW_MINERAL_ROLE] = true;
        _allowedRoles[JEWEL_FACTORY_ROLE] = true;
        _allowedRoles[DISTRIBUTOR_ROLE] = true;
        _allowedRoles[STORE_ROLE] = true;

        createUser(msg.sender, ADMIN_ROLE, "Admin");
    }

    /**
     * @notice create a new user by Owner
     * @param _userAddress the address of new user
     * @param _role the role of new user
     */
    function createUser(address _userAddress, bytes32 _role, string memory _name)
        public
        onlyOwner
        checkIfZerroAddress(_userAddress)
    {
        if (_usersMapping[_userAddress] != 0) {
            revert UsersJewelsChain__UserExisted(_userAddress);
        }
        if (!_allowedRoles[_role]) {
            revert UsersJewelsChain__UserInvalidRole(_userAddress, _role);
        }

        User memory _user = User({user: _userAddress, role: _role, isActive: true, name: _name});

        _usersArray.push(_user);
        _usersMapping[_userAddress] = _usersArray.length;
        _grantRole(_role, _userAddress);

        emit UsersJewelsChain__UserCreated(_userAddress, _role, true);
    }

    /**
     * @notice update the status of a user
     * @param _userAddress the address of user
     * @param _isActive the new status of the user
     */
    function updateStatusUser(address _userAddress, bool _isActive)
        external
        override
        onlyOwner
        checkIfUserExist(_userAddress)
    {
        uint256 _index = _usersMapping[_userAddress];
        User memory _user = _usersArray[_index - 1];

        if (_user.isActive == _isActive) {
            revert UsersJewelsChain__UserHasSameStatus(_userAddress, _isActive);
        }

        _user.isActive = _isActive;
        _usersArray[_index - 1] = _user;

        emit UsersJewelsChain__UserUpdatedStatus(_userAddress, _isActive);
    }

    /**
     * @notice delete a user by Owner
     * @param _userAddress the address of user
     */
    function deleteUser(address _userAddress) external override onlyOwner checkIfUserExist(_userAddress) {
        uint256 _index = _usersMapping[_userAddress];

        User memory _user = _getUser(_userAddress);
        _revokeRole(_user.role, _userAddress);

        // swap the last user to the deleted and remove it from array
        _usersArray[_index - 1] = _usersArray[_usersArray.length - 1];
        _usersArray.pop();

        delete _usersMapping[_userAddress];
        emit UsersJewelsChain__UserDeleted(_userAddress);
    }

    /**
     * @notice Check if an address has a specific role
     * @param _userAddress The address to check
     * @param _role The role to check, as a string
     * @return bool indicating whether the address has the specified role
     */
    function checkUserRole(address _userAddress, bytes32 _role) external view override returns (bool) {
        return hasRole(_role, _userAddress);
    }

    /**
     * @dev NOTE: this function is not efficient.
     * @notice get list of users
     */
    function getListUsers() external view override onlyOwner returns (User[] memory) {
        return _usersArray;
    }

    /**
     * @notice get a user by address
     */
    function getUser(address _userAddress)
        external
        view
        override
        onlyOwner
        checkIfUserExist(_userAddress)
        returns (User memory)
    {
        return _getUser(_userAddress);
    }

    function loginUser() external view override checkIfUserExist(msg.sender) returns (User memory) {
        User memory user = _getUser(msg.sender);
        if (!user.isActive) {
            revert UsersJewelsChain__UserIsNotActive(msg.sender);
        }
        return _getUser(msg.sender);
    }

    function getRoleUser(address _userAddress)
        external
        view
        override
        checkIfUserExist(_userAddress)
        returns (bytes32)
    {
        return _getUser(_userAddress).role;
    }

    function getUsersByRole(bytes32 role) external view checkIfUserExist(msg.sender) returns (User[] memory) {
        // NOTA: por simplicidad se realiza el filtro del role desde aqui. INEFICIENTE - Y posibilidad de bug por quedarse sin gas - Mejor desde offchain
        uint256 count = 0;

        // Contar los usuarios que tienen el rol y están activos
        for (uint256 i = 0; i < _usersArray.length; i++) {
            if (_usersArray[i].role == role && _usersArray[i].isActive) {
                count++;
            }
        }

        // Crear un nuevo array para los usuarios filtrados
        User[] memory filteredUsers = new User[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < _usersArray.length; i++) {
            if (_usersArray[i].role == role && _usersArray[i].isActive) {
                filteredUsers[index] = _usersArray[i];
                index++;
            }
        }

        return filteredUsers;
    }

    function getUserName(address _userAddress)
        external
        view
        override
        checkIfUserExist(_userAddress)
        returns (string memory)
    {
        User memory user = _getUser(_userAddress);
        return user.name;
    }

    /**
     * Private functions
     */
    function _getUser(address _userAddress) private view returns (User memory) {
        uint256 _index = _usersMapping[_userAddress];
        return _usersArray[_index - 1];
    }
}
