// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserContract {
    struct Participant {
        address userAddress;
        string name;
        string role;
        bool isActive;
    }

    address public owner;
    Participant[] private participants;
    mapping(address => bool) public isParticipant;

    event ParticipantAdded(address indexed userAddress, string name, string role);

    constructor() {
        owner = msg.sender;
        participants.push(Participant({
            userAddress: owner,
            name: "Owner",
            role: "admin",
            isActive: true
        }));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addParticipante(
        address _address,
        string memory _name,
        string memory _role
    ) public onlyOwner {
        require(_address != address(0), "Invalid address");
        require(!isParticipant[_address], "Participant already exists");
        
        participants.push(Participant({
            userAddress: _address,
            name: _name,
            role: _role,
            isActive: true
        }));
        
        isParticipant[_address] = true;
        
        emit ParticipantAdded(_address, _name, _role);
    }

    function getParticipants() public view returns (Participant[] memory) {
        return participants;
    }

    function getParticipantCount() public view returns (uint256) {
        return participants.length;
    }
}
