import { ShipmentSC } from "@/domain/distributor/Distributor";
import { IDistributor } from "./IDistributor";
import { BrowserProvider, Contract, TransactionReceipt, TransactionResponse } from "ethers";
import { DISTRIBUTOR_ABI } from "@/abis/distributor";

export class DistributorSC implements IDistributor {

  private provider: BrowserProvider;

  constructor(provider: BrowserProvider) {
    this.provider = provider;
  }


  async getShipments(): Promise<ShipmentSC[]> {
    const contract: Contract = await this.getContractDistributor();
    const shipmentsSC: ShipmentSC[] = await contract.getShipments();
    return shipmentsSC;
  }
  getShipmentByTrackingId(trackingId: string): Promise<ShipmentSC> {
    throw new Error("Method not implemented." + trackingId);
  }

  async confirmDelivery(trackingId: string): Promise<TransactionReceipt> {
    const contract: Contract = await this.getContractDistributor();
    const gasEstimate: bigint = await contract.confirmDelivery.estimateGas(trackingId);
    const distributorDelivery: TransactionResponse = await contract.confirmDelivery(trackingId, { gasLimite: gasEstimate });
    const distributorTransaction: TransactionReceipt | null = await distributorDelivery.wait();
    if (distributorTransaction == null) {
      throw Error('Transaction failed');
    }
    return distributorTransaction;
  }

  async getContractDistributor(): Promise<Contract> {
    const signer = await this.provider.getSigner();
    const ADDRESS = process.env.NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ADDRESS as string;
    if (!ADDRESS) throw new Error("La dirección del rawMineralContract no está definida");
    return new Contract(ADDRESS, DISTRIBUTOR_ABI, signer)
  }

}