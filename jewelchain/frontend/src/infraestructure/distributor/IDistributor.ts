import { ShipmentSC } from "@/domain/distributor/Distributor";
import { TransactionReceipt } from "ethers";

export interface IDistributor {
  getShipments(): Promise<ShipmentSC[]>;
  getShipmentByTrackingId(trackingId: string): Promise<ShipmentSC>;
  confirmDelivery(trackingId: string): Promise<TransactionReceipt>;
}