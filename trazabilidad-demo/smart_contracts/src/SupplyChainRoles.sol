// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainRoles {
    // Enums
    enum Role { Farmer, Factory, Retailer, Consumer, None }
    enum TransferStatus { Sent, Received, Rejected }

    // Structures
    struct ProductBalance {
        string name;
        uint256 balance;
    }

    struct Balance {
        address participantAddress;
        Role role;
        ProductBalance[] products;
    }

    struct Transfer {
        address from;
        address to;
        uint256 timestamp;
        string product;
        uint256 amount;
        TransferStatus status;
    }

    struct AddAmount {
        address participantAddress;
        uint256 timestamp;
        Role role;
        string product;
        uint256 amountAdd;
    }

    // State variables
    mapping(address => Role) public roles;
    mapping(address => Balance) public balances;
    mapping(address => bool) public isParticipant;
    
    Transfer[] public transfers;
    AddAmount[] public additions;
    address[] public participants;

    address public owner;

    // Events
    event RoleAssigned(address indexed participant, Role role);
    event AmountAdded(address indexed participant, string product, uint256 amount);
    event TransferCreated(
        address indexed from,
        address indexed to,
        string product,
        uint256 amount,
        TransferStatus status
    );
    event ProductAdded(address indexed participant, string product);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Incorrect role");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Assign role to participant
     */
    function assignRole(address _participant, Role _role) public  {
        require(_role != Role.None, "Invalid role");
        // require(roles[_participant] == Role.None, "Role already assigned");

        roles[_participant] = _role;
        if (!isParticipant[_participant]) {
            participants.push(_participant);
            isParticipant[_participant] = true;
            
            // Initialize balance structure
            balances[_participant].participantAddress = _participant;
            balances[_participant].role = _role;
        }

        emit RoleAssigned(_participant, _role);
    }

    /**
     * @dev Add amount to participant's balance
     */
    function addAmount(
        address _participant,
        string memory _product,
        uint256 _amount
    ) public  {
        require(roles[_participant] != Role.None, "Participant not registered");
        require(_amount > 0, "Amount must be greater than 0");

        bool productFound = false;
        Balance storage participantBalance = balances[_participant];

        // Check if product exists and update balance
        for (uint i = 0; i < participantBalance.products.length; i++) {
            if (keccak256(bytes(participantBalance.products[i].name)) == keccak256(bytes(_product))) {
                participantBalance.products[i].balance += _amount;
                productFound = true;
                break;
            }
        }

        // If product doesn't exist, add it
        if (!productFound) {
            participantBalance.products.push(ProductBalance({
                name: _product,
                balance: _amount
            }));
            emit ProductAdded(_participant, _product);
        }

        // Record addition
        additions.push(AddAmount({
            participantAddress: _participant,
            timestamp: block.timestamp,
            role: roles[_participant],
            product: _product,
            amountAdd: _amount
        }));

        emit AmountAdded(_participant, _product, _amount);
    }

    /**
     * @dev Transfer products between participants
     */
    function transfer(
        address _to,
        string memory _product,
        uint256 _amount
    ) public {
        require(roles[msg.sender] != Role.None, "Sender not registered");
        require(roles[_to] != Role.None, "Recipient not registered");
        require(_amount > 0, "Amount must be greater than 0");

        // Validate transfer path
        require(isValidTransfer(msg.sender, _to), "Invalid transfer path");

        // Check and update sender's balance
        Balance storage senderBalance = balances[msg.sender];
        Balance storage receiverBalance = balances[_to];
        bool productFound = false;
        uint256 senderProductIndex;

        for (uint i = 0; i < senderBalance.products.length; i++) {
            if (keccak256(bytes(senderBalance.products[i].name)) == keccak256(bytes(_product))) {
                require(senderBalance.products[i].balance >= _amount, "Insufficient balance");
                senderBalance.products[i].balance -= _amount;
                senderProductIndex = i;
                productFound = true;
                break;
            }
        }

        require(productFound, "Product not found in sender's balance");

        // Update receiver's balance
        bool receiverProductFound = false;
        for (uint i = 0; i < receiverBalance.products.length; i++) {
            if (keccak256(bytes(receiverBalance.products[i].name)) == keccak256(bytes(_product))) {
                receiverBalance.products[i].balance += _amount;
                receiverProductFound = true;
                break;
            }
        }

        if (!receiverProductFound) {
            receiverBalance.products.push(ProductBalance({
                name: _product,
                balance: _amount
            }));
        }

        // Record transfer
        transfers.push(Transfer({
            from: msg.sender,
            to: _to,
            timestamp: block.timestamp,
            product: _product,
            amount: _amount,
            status: TransferStatus.Sent
        }));

        emit TransferCreated(msg.sender, _to, _product, _amount, TransferStatus.Sent);
    }

    /**
     * @dev Validate transfer path based on roles
     */
    function isValidTransfer(address _from, address _to) public view returns (bool) {
        Role fromRole = roles[_from];
        Role toRole = roles[_to];

        if (fromRole == Role.Farmer) return toRole == Role.Factory;
        if (fromRole == Role.Factory) return toRole == Role.Retailer;
        if (fromRole == Role.Retailer) return toRole == Role.Consumer;
        return false;
    }

    /**
     * @dev Get transfers by sender address
     */
    function getTransferByAddressFrom(address _from) 
        public 
        view 
        returns (Transfer[] memory) 
    {
        uint256 count = 0;
        for (uint256 i = 0; i < transfers.length; i++) {
            if (transfers[i].from == _from) count++;
        }

        Transfer[] memory result = new Transfer[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < transfers.length; i++) {
            if (transfers[i].from == _from) {
                result[index] = transfers[i];
                index++;
            }
        }
        
        return result;
    }

    /**
     * @dev Get transfers by recipient address
     */
    function getTransferByAddressTo(address _to) 
        public 
        view 
        returns (Transfer[] memory) 
    {
        uint256 count = 0;
        for (uint256 i = 0; i < transfers.length; i++) {
            if (transfers[i].to == _to) count++;
        }

        Transfer[] memory result = new Transfer[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < transfers.length; i++) {
            if (transfers[i].to == _to) {
                result[index] = transfers[i];
                index++;
            }
        }
        
        return result;
    }

    /**
     * @dev Get balance by address
     */
    function getBalanceByAddress(address _participant) 
        public 
        view 
        returns (Balance memory) 
    {
        require(roles[_participant] != Role.None, "Participant not registered");
        return balances[_participant];
    }

    /**
     * @dev Get all participants
     */
    function getAllParticipants() 
        public 
        view 
        returns (address[] memory addresses, Role[] memory participantRoles) 
    {
        addresses = new address[](participants.length);
        participantRoles = new Role[](participants.length);
        
        for (uint256 i = 0; i < participants.length; i++) {
            addresses[i] = participants[i];
            participantRoles[i] = roles[participants[i]];
        }
        
        return (addresses, participantRoles);
    }

    /**
     * @dev Get all transfers
     */
    function getAllTransfers() 
        public 
        view 
        returns (Transfer[] memory) 
    {
        return transfers;
    }
}
