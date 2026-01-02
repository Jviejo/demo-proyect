import { RecordType } from "../raw-mineral/RawMineral";

export interface ShipmentSC {
  shipper: string;
  receiver: string;
  trackingId: string;
  shipperDate: number;
  deliveryDate?: number;
  jewelChain: string;
}

export interface Shipment extends ShipmentSC {
  supplier: string;
  uniqueId: string;
  name: string;
  date: number;
  quantity: number;
  recordType: RecordType;
  data: string;
  img: string;
}