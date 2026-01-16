'use client'

import { Web3 } from "web3"
import { abi as abiTracker } from "./contracts/BloodTracker"
import { abi as abiDonation } from "./contracts/BloodDonation"
import { abi as abiDerivative } from "./contracts/BloodDerivative"
import { Address, DonationEventLog, EventTrace, EventType, TransferEventLog, PatientAdministeredEventLog, BatchCreatedEventLog } from "./types"

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// Initialize Web3 and contracts only on client side
const getWeb3Instance = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return new Web3(window.ethereum || "https://testnet.tscscan.io/testrpc");
};

const getContracts = () => {
  const web3 = getWeb3Instance();
  if (!web3) {
    return { web3: null, contractTracker: null, contractDonation: null, contractDerivative: null };
  }

  return {
    web3,
    contractTracker: new web3.eth.Contract(abiTracker, process.env.NEXT_PUBLIC_BLD_TRACKER_CONTRACT_ADDRESS),
    contractDonation: new web3.eth.Contract(abiDonation, process.env.NEXT_PUBLIC_BLD_DONATION_CONTRACT_ADDRESS),
    contractDerivative: new web3.eth.Contract(abiDerivative, process.env.NEXT_PUBLIC_BLD_DERIVATIVE_CONTRACT_ADDRESS)
  };
};

/**
 * Recupera el listado de las donaciones realizadas por un donante
 * @param address Dirección del donante
 * @returns Registro de donaciones realizadas por el donante
 */
export async function getDonations(address: string) {
    const { web3, contractTracker } = getContracts();
    if (!web3 || !contractTracker) return [];

    const donations = []

    // Obtener el bloque actual
    const latestBlock = Number(await web3.eth.getBlockNumber())

    // Besu tiene un límite de rango, así que consultamos en chunks
    const CHUNK_SIZE = 1000
    const allEventsRaw: any[] = []

    // Calcular el bloque de inicio (últimos 10000 bloques o desde deployment)
    const deploymentBlock = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0
    const startBlock = Math.max(deploymentBlock, latestBlock - 10000)

    for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
        const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

        try {
            const events = await contractTracker.getPastEvents('Donation', {
                filter: { donor: address },
                fromBlock,
                toBlock
            })
            allEventsRaw.push(...events)
        } catch (chunkError) {
            console.error(`Error fetching donations chunk ${fromBlock}-${toBlock}:`, chunkError)
        }
    }

    const events = allEventsRaw as DonationEventLog[]

    for (const event of events) {
        //consulta tracker para obtener nombre y localización del centro
        const { name, location } = await contractTracker.methods.companies(event.returnValues.center).call()
        //consulta bloque para obtener la hora
        const { timestamp } = await web3.eth.getBlock(event.blockHash)
        donations.push({
            donationId: event.returnValues.tokenId,
            donationCenter: event.returnValues.center,
            centerName: name,
            centerLocation: location,
            datetime: new Date(Number(timestamp) * 1000),
            value: event.returnValues.value
        })
    }
    return donations
}

/**
 * Recupera el listado de las extracciones realizadas por un centro de extracción
 * @param address Dirección del centro de extracción
 * @returns Registro de extracciones realizadas por el centro
 */
export async function getExtractions(address: string) {
    const { web3, contractTracker } = getContracts();
    if (!web3 || !contractTracker) return [];

    const donations = []

    // Obtener el bloque actual
    const latestBlock = Number(await web3.eth.getBlockNumber())

    // Besu tiene un límite de rango, así que consultamos en chunks
    const CHUNK_SIZE = 1000
    const allEventsRaw: any[] = []

    // Calcular el bloque de inicio (últimos 10000 bloques o desde deployment)
    const deploymentBlock = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0
    const startBlock = Math.max(deploymentBlock, latestBlock - 10000)

    for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
        const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

        try {
            const events = await contractTracker.getPastEvents('Donation', {
                filter: { center: address },
                fromBlock,
                toBlock
            })
            allEventsRaw.push(...events)
        } catch (chunkError) {
            console.error(`Error fetching extractions chunk ${fromBlock}-${toBlock}:`, chunkError)
        }
    }

    const events = allEventsRaw as DonationEventLog[]

    for (const event of events) {
        //consulta bloque para obtener la hora
        const { timestamp } = await web3.eth.getBlock(event.blockHash)
        donations.push({
            donationId: event.returnValues.tokenId,
            donor: event.returnValues.donor,
            datetime: new Date(Number(timestamp) * 1000),
            value: event.returnValues.value
        })
    }
    return donations
}

/**
 * Recupera el listado de los procesamientos realizados por un laboratorio
 * @param address Dirección del laboratorio
 * @returns Registro de procesamientos realizados por el laboratorio
 */
export async function getProcesses(address: string) {
    const { web3, contractDonation } = getContracts();
    if (!contractDonation || !web3) return [];

    // Obtener el bloque actual
    const latestBlock = Number(await web3.eth.getBlockNumber())

    // Besu tiene un límite de rango, así que consultamos en chunks
    const CHUNK_SIZE = 1000
    const allEventsRaw: any[] = []

    // Calcular el bloque de inicio (últimos 10000 bloques o desde deployment)
    const deploymentBlock = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0
    const startBlock = Math.max(deploymentBlock, latestBlock - 10000)

    for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
        const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

        try {
            const events = await contractDonation.getPastEvents('Transfer', {
                filter: { from: address, to: ZERO_ADDRESS },
                fromBlock,
                toBlock
            })
            allEventsRaw.push(...events)
        } catch (chunkError) {
            console.error(`Error fetching processes chunk ${fromBlock}-${toBlock}:`, chunkError)
        }
    }

    return allEventsRaw
}

/**
 * Recupera la trazabilidad de un token de donación o de derivado.
 * @param tokenId Id del token que se desea la traza. Puede ser de una donación o un derivado
 * @returns Traza completa del evento Transfer
 */
export async function getEventsFromDonation(tokenId: number) {
    const { web3, contractDonation } = getContracts();
    if (!contractDonation || !web3) {
        console.log('getEventsFromDonation: No contract available')
        return [];
    }

    console.log(`getEventsFromDonation: Fetching events for tokenId ${tokenId}`)

    // Obtener el bloque actual
    const latestBlock = Number(await web3.eth.getBlockNumber())

    // Besu tiene un límite de rango, así que consultamos en chunks
    const CHUNK_SIZE = 1000
    const allEventsRaw: any[] = []

    // Calcular el bloque de inicio (últimos 10000 bloques o desde deployment)
    const deploymentBlock = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0
    const startBlock = Math.max(deploymentBlock, latestBlock - 10000)

    console.log(`getEventsFromDonation: Querying from block ${startBlock} to ${latestBlock}`)

    for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
        const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

        try {
            const events = await contractDonation.getPastEvents('Transfer', {
                fromBlock,
                toBlock
            })
            allEventsRaw.push(...events)
        } catch (chunkError) {
            console.error(`Error fetching donation chunk ${fromBlock}-${toBlock}:`, chunkError)
        }
    }

    const allEvents = allEventsRaw as TransferEventLog[]
    console.log(`getEventsFromDonation: Found ${allEvents.length} total Transfer events`)

    // Filtrar manualmente por tokenId
    const events = allEvents.filter(event => {
        const eventTokenId = Number(event.returnValues.tokenId)
        return eventTokenId === tokenId
    })

    console.log(`getEventsFromDonation: Filtered to ${events.length} events for tokenId ${tokenId}`)

    return formatEvent(events)
}

/**
 * Recupera la trazabilidad de un token de donación o de derivado.
 * @param tokenId Id del token que se desea la traza. Puede ser de una donación o un derivado
 * @returns Traza completa del evento Transfer
 */
export async function getEventsFromDerivative(tokenId: number, fromBlock: number = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0) {
    const { web3, contractDerivative } = getContracts();
    if (!contractDerivative || !web3) return [];

    // Convertir a número si viene como BigInt
    const tokenIdNum = typeof tokenId === 'bigint' ? Number(tokenId) : tokenId

    // Validar que tokenId sea un número válido
    if (tokenIdNum === null || tokenIdNum === undefined || isNaN(tokenIdNum)) {
        console.error('getEventsFromDerivative: Invalid tokenId', tokenId);
        return [];
    }

    console.log(`getEventsFromDerivative: Fetching events for tokenId ${tokenIdNum}`)

    // Obtener el bloque actual
    const latestBlock = Number(await web3.eth.getBlockNumber())

    // Besu tiene un límite de rango, así que consultamos en chunks
    const CHUNK_SIZE = 1000
    const allEventsRaw: any[] = []

    // Calcular el bloque de inicio (últimos 10000 bloques o desde deployment/fromBlock)
    const deploymentBlock = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0
    const validFromBlock = Math.max(fromBlock || deploymentBlock, 0)
    const startBlock = Math.max(validFromBlock, latestBlock - 10000)

    console.log(`getEventsFromDerivative: Querying from block ${startBlock} to ${latestBlock}`)

    for (let fromBlockChunk = startBlock; fromBlockChunk <= latestBlock; fromBlockChunk += CHUNK_SIZE) {
        const toBlock = Math.min(fromBlockChunk + CHUNK_SIZE - 1, latestBlock)

        try {
            const events = await contractDerivative.getPastEvents('Transfer', {
                fromBlock: fromBlockChunk,
                toBlock
            })
            allEventsRaw.push(...events)
        } catch (chunkError) {
            console.error(`Error fetching derivative chunk ${fromBlockChunk}-${toBlock}:`, chunkError)
        }
    }

    const allEvents = allEventsRaw as TransferEventLog[]
    console.log(`getEventsFromDerivative: Found ${allEvents.length} total Transfer events`)

    // Filtrar manualmente por tokenId
    const events = allEvents.filter(event => {
        return Number(event.returnValues.tokenId) === tokenIdNum
    })

    console.log(`getEventsFromDerivative: Filtered to ${events.length} events for tokenId ${tokenIdNum}`)

    return formatEvent(events)
}

/**
 * Obtiene el evento PatientAdministered de un tokenId específico
 * @param tokenId Id del token (donación o derivado)
 * @param isBloodBag Si es una bolsa completa o derivado
 */
/**
 * Obtiene el evento BatchCreated si un derivado fue usado en un lote
 * @param tokenId Id del derivado
 */
async function getManufacturerBatchEvent(tokenId: number): Promise<EventTrace | null> {
    const { web3, contractTracker } = getContracts();
    if (!web3 || !contractTracker) return null;

    try {
        // Obtener el bloque actual
        const latestBlock = Number(await web3.eth.getBlockNumber())

        // Besu tiene un límite de rango, así que consultamos en chunks
        const CHUNK_SIZE = 1000
        const allEventsRaw: any[] = []

        // Calcular el bloque de inicio (últimos 10000 bloques o desde deployment)
        const deploymentBlock = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0
        const startBlock = Math.max(deploymentBlock, latestBlock - 10000)

        for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
            const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

            try {
                const events = await contractTracker.getPastEvents('BatchCreated', {
                    fromBlock,
                    toBlock
                })
                allEventsRaw.push(...events)
            } catch (chunkError) {
                console.error(`Error fetching batch chunk ${fromBlock}-${toBlock}:`, chunkError)
            }
        }

        const allEvents = allEventsRaw as BatchCreatedEventLog[]

        // Buscar el evento que contiene este tokenId en derivativeIds
        const matchingEvent = allEvents.find(event => {
            const derivativeIds = event.returnValues.derivativeIds.map(id => Number(id))
            return derivativeIds.includes(tokenId)
        })

        if (!matchingEvent) return null;

        // Obtener información del manufacturer
        const { name, location } = await contractTracker.methods.companies(matchingEvent.returnValues.manufacturer).call()

        return {
            blockNumber: Number(matchingEvent.blockNumber),
            event: EventType.ManufacturerBatch,
            owner: String(matchingEvent.returnValues.manufacturer) as Address,
            name: name,
            location: location,
            timestamp: new Date(Number(matchingEvent.returnValues.timestamp) * 1000),
            batchId: Number(matchingEvent.returnValues.batchId),
            productType: String(matchingEvent.returnValues.productType),
            derivativeIds: matchingEvent.returnValues.derivativeIds.map(id => Number(id))
        }
    } catch (error) {
        console.error(`Error fetching manufacturer batch for derivative ${tokenId}:`, error)
        return null
    }
}

async function getPatientAdministrationEvent(tokenId: number, expectedIsBloodBag: boolean): Promise<EventTrace | null> {
    const { web3, contractTracker } = getContracts();
    if (!web3 || !contractTracker) return null;

    try {
        // Obtener el bloque actual
        const latestBlock = Number(await web3.eth.getBlockNumber())

        // Besu tiene un límite de rango, así que consultamos en chunks
        const CHUNK_SIZE = 1000
        const allEventsRaw: any[] = []

        // Calcular el bloque de inicio (últimos 10000 bloques o desde deployment)
        const deploymentBlock = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0
        const startBlock = Math.max(deploymentBlock, latestBlock - 10000)

        for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
            const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

            try {
                const events = await contractTracker.getPastEvents('PatientAdministered', {
                    filter: { tokenId: tokenId },
                    fromBlock,
                    toBlock
                })
                allEventsRaw.push(...events)
            } catch (chunkError) {
                console.error(`Error fetching patient admin chunk ${fromBlock}-${toBlock}:`, chunkError)
            }
        }

        const events = allEventsRaw as PatientAdministeredEventLog[]

        // Filtrar por isBloodBag para asegurar que coincida con el tipo esperado
        const matchingEvent = events.find(e => Boolean(e.returnValues.isBloodBag) === expectedIsBloodBag)

        if (!matchingEvent) return null;

        // Obtener información adicional del mapping
        const administration = await contractTracker.methods.administeredToPatients(tokenId).call()

        // Obtener información del hospital
        const { name, location } = await contractTracker.methods.companies(matchingEvent.returnValues.hospital).call()

        return {
            blockNumber: Number(matchingEvent.blockNumber),
            event: EventType.PatientAdministration,
            owner: String(matchingEvent.returnValues.hospital) as Address,
            name: name,
            location: location,
            timestamp: new Date(Number(matchingEvent.returnValues.timestamp) * 1000),
            patientId: String(matchingEvent.returnValues.patientId),
            medicalReason: String(administration.medicalReason)
        }
    } catch (error) {
        console.error(`Error fetching patient administration for token ${tokenId}:`, error)
        return null
    }
}

/**
 * Recupera la trazabilidad completa de una donación a partir de la donación
 * @param tokenId Id de la donación original
 */
export async function getTraceFromDonation(tokenId: number) {
    const { contractDonation } = getContracts();
    if (!contractDonation) return { donationTrace: undefined };

    const donationTrace = await getEventsFromDonation(tokenId)

    // Si no encuentra eventos entonces es que la donación no existe
    if (!donationTrace.length) return { donationTrace: undefined }

    // Verificar si hay administración a paciente para la donación original
    const donationAdministration = await getPatientAdministrationEvent(tokenId, true)
    if (donationAdministration) {
        donationTrace.push(donationAdministration)
    }

    const donation = {
        tokenId: tokenId,
        trace: donationTrace
    }

    // Número del bloque en el que se hizo el procesamiento
    const processBlock = donationTrace.find(t => {
        return t.event === EventType.Consummation
    })

    // Si no hay bloque de procesamiento, salimos
    if (!processBlock) return { donationTrace: donation }

    // Consultamos los Ids de los derivados
    const { plasmaId, erythrocytesId, plateletsId } = await contractDonation.methods.donations(tokenId).call()

    const plasmaTrace = await getEventsFromDerivative(plasmaId as number, Number(processBlock.blockNumber))
    const erythrocytesTrace = await getEventsFromDerivative(erythrocytesId as number, Number(processBlock.blockNumber))
    const plateletsTrace = await getEventsFromDerivative(plateletsId as number, Number(processBlock.blockNumber))

    // Verificar si hay lote manufacturado para cada derivado
    const plasmaBatch = await getManufacturerBatchEvent(Number(plasmaId))
    if (plasmaBatch) {
        plasmaTrace.push(plasmaBatch)
    }

    const erythrocytesBatch = await getManufacturerBatchEvent(Number(erythrocytesId))
    if (erythrocytesBatch) {
        erythrocytesTrace.push(erythrocytesBatch)
    }

    const plateletsBatch = await getManufacturerBatchEvent(Number(plateletsId))
    if (plateletsBatch) {
        plateletsTrace.push(plateletsBatch)
    }

    // Verificar si hay administración a paciente para cada derivado
    const plasmaAdministration = await getPatientAdministrationEvent(Number(plasmaId), false)
    if (plasmaAdministration) {
        plasmaTrace.push(plasmaAdministration)
    }

    const erythrocytesAdministration = await getPatientAdministrationEvent(Number(erythrocytesId), false)
    if (erythrocytesAdministration) {
        erythrocytesTrace.push(erythrocytesAdministration)
    }

    const plateletsAdministration = await getPatientAdministrationEvent(Number(plateletsId), false)
    if (plateletsAdministration) {
        plateletsTrace.push(plateletsAdministration)
    }

    return {
        donationTrace: donation,
        plasmaTrace: {
            tokenId: Number(plasmaId),
            trace: plasmaTrace
        },
        erythrocytesTrace: {
            tokenId: Number(erythrocytesId),
            trace: erythrocytesTrace
        },
        plateletsTrace: {
            tokenId: Number(plateletsId),
            trace: plateletsTrace
        }
    }
}

export async function getTokenIdOriginFromDerivative(tokenId: number) {
    const { contractDerivative } = getContracts();
    if (!contractDerivative) return undefined;

    const { tokenIdOrigin } = await contractDerivative.methods.products(tokenId).call()
    if (!tokenIdOrigin) return
    return await getTraceFromDonation(tokenIdOrigin as number)
}

/**
 * Recupera las administraciones a pacientes realizadas por un hospital
 * @param hospitalAddress Dirección del hospital
 * @returns Registro de administraciones realizadas por el hospital
 */
export async function getPatientAdministrations(hospitalAddress: string) {
    const { web3, contractTracker } = getContracts();
    if (!web3 || !contractTracker) return [];

    const administrations = []

    // Obtener el bloque actual
    const latestBlock = Number(await web3.eth.getBlockNumber())

    // Besu tiene un límite de rango, así que consultamos en chunks
    const CHUNK_SIZE = 1000
    const allEventsRaw: any[] = []

    // Calcular el bloque de inicio (últimos 10000 bloques o desde deployment)
    const deploymentBlock = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0
    const startBlock = Math.max(deploymentBlock, latestBlock - 10000)

    console.log(`getPatientAdministrations: Querying from block ${startBlock} to ${latestBlock}`)

    for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
        const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

        try {
            const events = await contractTracker.getPastEvents('PatientAdministered', {
                fromBlock,
                toBlock
            })
            allEventsRaw.push(...events)
        } catch (chunkError) {
            console.error(`Error fetching patient admin chunk ${fromBlock}-${toBlock}:`, chunkError)
        }
    }

    const allEvents = allEventsRaw as PatientAdministeredEventLog[]
    console.log(`getPatientAdministrations: Found ${allEvents.length} total PatientAdministered events`)

    // Filtrar manualmente por dirección del hospital
    const hospitalChecksum = web3.utils.toChecksumAddress(hospitalAddress)

    for (const event of allEvents) {
        const eventHospital = web3.utils.toChecksumAddress(String(event.returnValues.hospital))

        if (eventHospital === hospitalChecksum) {
            const tokenId = Number(event.returnValues.tokenId)

            // Obtener medicalReason del mapping del contrato
            let medicalReason = ''
            try {
                const administration = await contractTracker.methods.administeredToPatients(tokenId).call()
                medicalReason = String(administration.medicalReason)
            } catch (error) {
                console.error(`Error fetching medicalReason for token ${tokenId}:`, error)
            }

            administrations.push({
                tokenId: tokenId,
                patientId: String(event.returnValues.patientId),
                medicalReason: medicalReason,
                isBloodBag: Boolean(event.returnValues.isBloodBag),
                administeredDate: new Date(Number(event.returnValues.timestamp) * 1000),
                hospital: String(event.returnValues.hospital) as Address
            })
        }
    }

    console.log(`getPatientAdministrations: Filtered to ${administrations.length} events for hospital ${hospitalChecksum}`)

    return administrations
}

/**
 * Recupera los lotes manufacturados creados por un fabricante
 * @param manufacturerAddress Dirección del fabricante
 * @returns Registro de lotes creados por el fabricante
 */
export async function getManufacturedBatches(manufacturerAddress: string) {
    const { web3, contractTracker } = getContracts();
    if (!contractTracker || !web3) return [];

    const batches = []

    // Obtener el bloque actual
    const latestBlock = Number(await web3.eth.getBlockNumber())

    // Besu tiene un límite de rango, así que consultamos en chunks
    const CHUNK_SIZE = 1000
    const allEventsRaw: any[] = []

    // Calcular el bloque de inicio (últimos 10000 bloques o desde deployment)
    const deploymentBlock = Number(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) || 0
    const startBlock = Math.max(deploymentBlock, latestBlock - 10000)

    for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
        const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock)

        try {
            const events = await contractTracker.getPastEvents('BatchCreated', {
                filter: { manufacturer: manufacturerAddress },
                fromBlock,
                toBlock
            })
            allEventsRaw.push(...events)
        } catch (chunkError) {
            console.error(`Error fetching batches chunk ${fromBlock}-${toBlock}:`, chunkError)
        }
    }

    const events = allEventsRaw as BatchCreatedEventLog[]

    for (const event of events) {
        batches.push({
            batchId: Number(event.returnValues.batchId),
            derivativeIds: event.returnValues.derivativeIds.map(id => Number(id)),
            productType: String(event.returnValues.productType),
            timestamp: new Date(Number(event.returnValues.timestamp) * 1000),
            manufacturer: String(event.returnValues.manufacturer) as Address
        })
    }

    return batches
}

async function formatEvent(events: TransferEventLog[]): Promise<EventTrace[]> {
    const { web3, contractTracker } = getContracts();
    if (!web3 || !contractTracker) return [];

    return await Promise.all(events.map(async e => {
        let event, owner: Address
        if (e.returnValues.from === ZERO_ADDRESS) {
            event = EventType.Generation
            owner = e.returnValues.to
        } else if (e.returnValues.to === ZERO_ADDRESS) {
            event = EventType.Consummation
            owner = e.returnValues.from
        } else {
            event = EventType.Transfer
            owner = e.returnValues.to
        }
        const blockNumber = Number(e.blockNumber)
        const { timestamp } = await web3.eth.getBlock(e.blockHash)
        const { name, location } = await contractTracker.methods.companies(owner).call()
        return {
            blockNumber: blockNumber,
            event: event,
            owner: owner,
            name: name,
            location: location,
            timestamp: new Date(Number(timestamp) * 1000)
        }
    }))
}
