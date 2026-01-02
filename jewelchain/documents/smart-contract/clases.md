classDiagram
    %% Interfaces
    class IJewelChain {
        <<Interface>>
        +createJewelRecord(bytes32 name, uint256 date, uint256 quantity, bytes calldata data)
        +getJewelRecordBySupplier(address supplier) external view returns (JewelRecord[] memory)
        +recieveMaterial(address distributor, address supplier, bytes32 trackingId, JewelRecord[] calldata jewels)
    }
    class IUser {
        <<Interface>>
        +createUser(address _userAddress, bytes32 _role, string memory _name) external
        +updateStatusUser(address _userAddress, bool _isActive) external
        +deleteUser(address _userAddress) external
        +checkUserRole(address _userAddress, bytes32 _role) external view returns (bool)
        +getListUsers() external view returns (User[] memory)
        +getUser(address _userAddress) external view returns (User memory)
        +loginUser() external view returns (User memory)
        +getRoleUser(address _userAddress) external view returns (bytes32)
    }
    class IDistributor {
        <<Interface>>
        +newShipment(address receiver, bytes calldata jewelChain) external
        +confirmDelivery(bytes32 trackingId) external
    }

    %% Smart Contracts
    class RawMineral {
        +specificMethod1()
    }
    class JewelFactory {
        +specificMethod2()
    }
    class Store {
        +specificMethod3()
    }
    class User {
        +specificMethod4()
    }
    class Distributor {
        +specificMethod5()
    }

    %% Relationships
    IJewelChain <|-- RawMineral
    IJewelChain <|-- JewelFactory

    IUser <|-- User
    IDistributor <|-- Distributor
