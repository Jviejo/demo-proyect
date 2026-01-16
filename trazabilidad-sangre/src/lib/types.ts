
import { EventLog } from "web3"

export type Address = `0x${string}`

// Resultado del evento Donation en BloodTracker
export type DonationEventValues = {
    donor: Address
    center: Address
    tokenId: bigint
    value: bigint
}
export interface DonationEventLog extends EventLog {
    returnValues: DonationEventValues
}

// Resultado del evento Transfer en el estander ERC721
export type TransferEventValues = {
    from: Address
    to: Address
    tokenId: bigint
}
export interface TransferEventLog extends EventLog {
    returnValues: TransferEventValues
}

export enum EventType {
    Generation = 'Generation',
    Transfer = 'Transfer',
    Consummation = 'Consumation',
    PatientAdministration = 'PatientAdministration',
    ManufacturerBatch = 'ManufacturerBatch'
}

export interface EventTrace {
    blockNumber: number
    event: EventType
    owner: Address
    name: string
    location: string
    timestamp: Date
    patientId?: string
    medicalReason?: string
    batchId?: number
    productType?: string
    derivativeIds?: number[]
}

export interface ProductTrace {
    tokenId: number
    trace: EventTrace[]
}

export enum Derivative {
    Plasma = 1,
    Erythrocytes = 2,
    Platelets = 3,
    Blood = 4
}

// Tipos para Hospital
export interface PatientAdministration {
    tokenId: number
    patientId: string
    medicalReason: string
    administeredDate: Date
    hospital: Address
    isBloodBag: boolean
}

// Tipos para Manufacturer
export interface ManufacturedBatch {
    batchId: number
    derivativeIds: number[]
    productType: string
    createdDate: Date
    manufacturer: Address
}

export enum ProductType {
    SERUM = "SERUM",
    CREAM = "CREAM",
    MASK = "MASK",
    TREATMENT = "TREATMENT",
    SUPPLEMENT = "SUPPLEMENT"
}

// Eventos nuevos
export type PatientAdministeredEventValues = {
    tokenId: bigint
    hospital: Address
    patientId: string
    isBloodBag: boolean
    timestamp: bigint
}

export interface PatientAdministeredEventLog extends EventLog {
    returnValues: PatientAdministeredEventValues
}

export type BatchCreatedEventValues = {
    batchId: bigint
    manufacturer: Address
    derivativeIds: bigint[]
    productType: string
    timestamp: bigint
}

export interface BatchCreatedEventLog extends EventLog {
    returnValues: BatchCreatedEventValues
}