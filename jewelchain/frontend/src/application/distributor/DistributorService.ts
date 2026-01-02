import { Shipment, ShipmentSC } from "@/domain/distributor/Distributor";
import { DistributorSC } from "@/infraestructure/distributor/Distributor";
import { IDistributor } from "@/infraestructure/distributor/IDistributor";
import { BrowserProvider, TransactionReceipt } from "ethers";
import { decodeBytes32String, unitToWei } from "../EthersUtils";
import { selectImgByName } from "@/utils/imagesUtils";
import { IJewelChain } from "@/infraestructure/IJewelChain";
import { RawMineralSC } from "@/infraestructure/RawMineralSC";
import { IJewelChainResponse, RecordType } from "@/domain/raw-mineral/RawMineral";

export class DistributorService {
  private distributorSC: IDistributor;
  private rawMineralSC: IJewelChain;
  constructor(provider: BrowserProvider) {
    this.distributorSC = new DistributorSC(provider);
    this.rawMineralSC = new RawMineralSC(provider);
  }

  public async getShipments() {
    const shipmentsSC: ShipmentSC[] = await this.distributorSC.getShipments();

    const shipments: Shipment[] = await Promise.all(
      shipmentsSC.map(async (shipment) => {
        const jewelRecord: IJewelChainResponse = await this.rawMineralSC.getJewelChainByBytes(shipment.jewelChain);
        const name: string = decodeBytes32String(jewelRecord.name);

        const ship: Shipment = {
          shipper: shipment.shipper,
          receiver: shipment.receiver,
          trackingId: shipment.trackingId,
          shipperDate: Number(unitToWei(Number(shipment.shipperDate))),
          deliveryDate: Number(unitToWei(Number(shipment.deliveryDate))),
          jewelChain: shipment.jewelChain,
          supplier: jewelRecord.supplier,
          name,
          uniqueId: jewelRecord.uniqueId,
          date: Number(unitToWei(Number(jewelRecord.date))),
          quantity: Number(unitToWei(Number(jewelRecord.quantity))),
          recordType: RecordType.MATERIAL,
          data: jewelRecord.data,
          img: selectImgByName(name),
        };

        return ship;
      }));
    return shipments;
  }

  public async confirmDelivery(trackingId: string): Promise<string> {
    const tx: TransactionReceipt = await this.distributorSC.confirmDelivery(trackingId);
    return tx.hash;
  }
}