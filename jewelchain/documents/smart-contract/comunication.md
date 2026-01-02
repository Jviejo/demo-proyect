graph TD
    Distributor --> |Entrega Material|RawMineral
    RawMineral --> |Envio Material|Distributor
    Distributor --> |Entrega Material|JewelFactory
    JewelFactory --> |Envio Material|Distributor
    Distributor --> |Entrega Material|Store
    Store --> |Envio Material|Distributor
    RawMineral -->|Solicitar info user| User
    JewelFactory -->|Solicitar info user| User
    Store -->|Solicitar info user| User