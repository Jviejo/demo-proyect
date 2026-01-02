import { ethers } from "ethers";
import "dotenv/config";
import { DISTRIBUTOR_ABI } from "./../abis/distributor.js";
import { RAW_MINERAL_ABI } from "../abis/raw-mineral.js";

const PROVIDER = new ethers.JsonRpcProvider(process.env.PROVIDER);

const ADDRESS_CONTRACT_RAW_MINERAL = process.env.RAW_MINERAL_CONTRACT_ADDRESS;
const ADDRESS_CONTRACT_DISTRIBUTOR =
    "0x86f1A0Dc6D21F40aD711803Dc9AC63ad3d589f2F";

// contratos
const contractDistributor = new ethers.Contract(
    ADDRESS_CONTRACT_DISTRIBUTOR,
    DISTRIBUTOR_ABI,
    PROVIDER,
);

const contractRawMineral = new ethers.Contract(
    ADDRESS_CONTRACT_RAW_MINERAL,
    RAW_MINERAL_ABI,
    PROVIDER,
);

const TRACKING_ID =
    "0x0e7919800216d666a70afbfcdea4eec9ea915415b20fb646d814b0448989259e";

/**
 * Este es el evento cuando al distriburtor recibe un nuevo pedido, a partir de este evento
 * se quiere saber cual es el elemento que se envio, que puede ser RAW_MINERAL / JEWEL_FACTORY
 * @param {*} trackingId
 */
const eventDistriburot_Shipment = async (trackingId) => {
    const eventFilter =
        contractDistributor.filters.Distributor__Shipment(trackingId);
    const events = await contractDistributor.queryFilter(eventFilter);

    console.log("Eventos", events);

    const eventsProcessed = await Promise.all(
        events.map(async (event) => {
            const deliveryBytes = event.args.delivery;
            console.log("deliveryBytes", deliveryBytes.jewelChain);

            const jewelRecord = await contractRawMineral.decodeJewel(
                deliveryBytes.jewelChain,
            );
            console.log("jewelRecord", jewelRecord);

            return {
                trackingId: event.args.trackingId,
                shipper: event.args.shipper,
                receiver: event.args.receiver,
                date: event.args.date,
                delivery: event.args.delivery,
                jewelChain: jewelRecord,
            };
        }),
    );

    console.log("Eventos procesados", eventsProcessed[0]);
    return eventsProcessed[0];
};

// NOTA: Se obtendrán los datos a partir del tracking
const getEvents = async (trackingId) => {
    const trackingEvent = await eventDistriburot_Shipment(trackingId);
    const shipperDate = trackingEvent.delivery.shipperDate;
    console.log("shipperDate", shipperDate);
    const uniqueId = trackingEvent.jewelChain.uniqueId;
    console.log("uniqueId", uniqueId);
    const dateCrationRawMineral = trackingEvent.jewelChain.date;
    console.log("dateCrationRawMineral", dateCrationRawMineral);
};

getEvents(TRACKING_ID);
