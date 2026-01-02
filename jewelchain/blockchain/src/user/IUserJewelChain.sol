// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

interface IUserJewelChain {
    /**
     * Structs
     */
    struct User {
        address user;
        bytes32 role;
        bool isActive;
        string name;
    }

    /**
     * Events
     */
    event UsersJewelsChain__UserCreated(address indexed _user, bytes32 role, bool isActive);
    event UsersJewelsChain__UserUpdatedStatus(address indexed _user, bool isActive);
    event UsersJewelsChain__UserDeleted(address indexed _user);

    /**
     * Errors
     */
    error UsersJewelsChain__UserInvalidAddress(address userAddress);
    error UsersJewelsChain__UserExisted(address userAddress);
    error UsersJewelsChain__UserNotFound(address userAddress);
    error UsersJewelsChain__UserHasSameStatus(address userAddress, bool isActive);
    error UsersJewelsChain__UserInvalidRole(address userAddress, bytes32 role);
    error UsersJewelsChain__UserIsNotActive(address userAddress);

    /**
     * Functions
     */
    function createUser(address _userAddress, bytes32 _role, string memory _name) external;
    function updateStatusUser(address _userAddress, bool _isActive) external;
    function deleteUser(address _userAddress) external;

    function checkUserRole(address _userAddress, bytes32 _role) external view returns (bool);

    function getListUsers() external view returns (User[] memory);
    function getUser(address _userAddress) external view returns (User memory);
    function loginUser() external view returns (User memory);
    function getRoleUser(address _userAddress) external view returns (bytes32);
    function getUsersByRole(bytes32 role) external view returns (User[] memory);
    function getUserName(address _userAddress) external view returns (string memory);
}
