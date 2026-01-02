// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tokenizar {
    enum Role {
        Producer,
        Factory,
        Retailer,
        Consumer,
        None
    }
    enum TransferStatus {
        Pending,
        Accepted,
        Rejected
    }

    struct Token {
        uint256 id;
        string name;
        address creator;
        uint256 amount;
        string features;
        uint256 timestamp;
        uint256 parentTokenId;
        mapping(address => uint256) balances;
    }

    struct TokenSalida {
        uint256 id;
        string name;
        address creator;
        uint256 amount;
        uint256 balance;
        string features;
        uint256 timestamp;
        uint256 parentTokenId;
    }

    struct Transfer {
        uint256 id;
        uint256 tokenId;
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        TransferStatus status;
    }

    mapping(uint256 => Token) public tokens;
    mapping(address => Role) public roles;
    Transfer[] public transfers;
    uint256 public nextTokenId;
    uint256 public nextTransferId;
    event TokenCreated(
        uint256 indexed tokenId,
        string name,
        uint256 amount,
        address creator
    );
    event TransferCreated(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 amount
    );
    event TransferStatusUpdated(
        uint256 indexed transferId,
        TransferStatus status
    );

    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Invalid role for this operation");
        _;
    }

    constructor() {
        
        nextTokenId = 1;
        nextTransferId = 0;
    }

    modifier validTransferPath(address _from, address _to) {
        Role fromRole = roles[_from];
        Role toRole = roles[_to];

        require(
            (fromRole == Role.Producer && toRole == Role.Factory) ||
                (fromRole == Role.Factory && toRole == Role.Retailer) ||
                (fromRole == Role.Retailer && toRole == Role.Consumer),
            "Invalid transfer path"
        );
        _;
    }

    function createToken(
        string memory _name,
        uint256 _amount,
        string memory _features,
        uint256 _parentTokenId
    ) public returns (uint256) {
        uint256 tokenId = nextTokenId++;
        Token storage newToken = tokens[tokenId];

        newToken.id = tokenId;
        newToken.name = _name;
        newToken.creator = msg.sender;
        newToken.amount = _amount;
        newToken.features = _features;
        newToken.timestamp = block.timestamp;
        newToken.parentTokenId = _parentTokenId;
        newToken.balances[msg.sender] = _amount;

        emit TokenCreated(tokenId, _name, _amount, msg.sender);
        return tokenId;
    }

    function transferToken(
        uint256 _tokenId,
        address _to,
        uint256 _amount
    ) public returns (uint256) {
        require(
            tokens[_tokenId].balances[msg.sender] >= _amount,
            "Insufficient balance"
        );
        uint256 transferId = nextTransferId++;
        transfers.push(
            Transfer({
                id: transferId,
                tokenId: _tokenId,
                from: msg.sender,
                to: _to,
                amount: _amount,
                timestamp: block.timestamp,
                status: TransferStatus.Pending  
            })
        );
        emit TransferCreated(_tokenId, msg.sender, _to, _amount);
        return transferId;
    }

    function acceptTransfer(uint256 _transferId) public {
        Transfer storage transfer = transfers[_transferId];
        require(transfer.to == msg.sender, "Not the transfer recipient");
        require(
            transfer.status == TransferStatus.Pending,
            "Transfer not pending"
        );
        require(
            tokens[transfer.tokenId].balances[transfer.from] >= transfer.amount,
            "Insufficient balance for transfer"
        );
        transfer.status = TransferStatus.Accepted;
        tokens[transfer.tokenId].balances[transfer.from] -= transfer.amount;
        tokens[transfer.tokenId].balances[transfer.to] += transfer.amount;

        emit TransferStatusUpdated(_transferId, TransferStatus.Accepted);
    }

    function rejectTransfer(uint256 _transferId) public {
        Transfer storage transfer = transfers[_transferId];
        require(transfer.to == msg.sender, "Not the transfer recipient");
        require(
            transfer.status == TransferStatus.Pending,
            "Transfer not pending"
        );

        transfer.status = TransferStatus.Rejected;
        emit TransferStatusUpdated(_transferId, TransferStatus.Rejected);
    }

    function getTokenTrace(
        uint256 _tokenId
    ) public view returns (Transfer[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < transfers.length; i++) {
            if (transfers[i].tokenId == _tokenId) {
                count++;
            }
        }

        Transfer[] memory tokenTransfers = new Transfer[](count);
        uint256 index = 0;
        for (uint i = 0; i < transfers.length; i++) {
            if (transfers[i].tokenId == _tokenId) {
                tokenTransfers[index] = transfers[i];
                index++;
            }
        }
        return tokenTransfers;
    }

    function getAddressTokens(
        address _address
    ) public view returns (TokenSalida[] memory) {

        uint256 count = 0;
        for (uint i = 0; i < nextTokenId; i++) {
            if (tokens[i].balances[_address] > 0) {
                count++;
            }
        }

        TokenSalida[] memory tokenSalidas = new TokenSalida[](count);

        uint256 index = 0;
        for (uint i = 0; i < nextTokenId; i++) {
            if (tokens[i].balances[_address] > 0) {
                tokenSalidas[index] = TokenSalida({
                    id: tokens[i].id,
                    name: tokens[i].name,
                    creator: tokens[i].creator,
                    amount: tokens[i].amount,
                    balance: tokens[i].balances[_address],
                    features: tokens[i].features,
                    timestamp: tokens[i].timestamp,
                    parentTokenId: tokens[i].parentTokenId
                });
                index++;
            }
        }
        return tokenSalidas;
    }

    function getReceivedTransfers(
        address _address
    ) public view returns (Transfer[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < transfers.length; i++) {
            if (transfers[i].to == _address) {
                count++;
            }
        }

        Transfer[] memory receivedTransfers = new Transfer[](count);
        uint256 index = 0;
        for (uint i = 0; i < transfers.length; i++) {
            if (transfers[i].to == _address) {
                receivedTransfers[index] = transfers[i];
                index++;
            }
        }
        return receivedTransfers;
    }
}
