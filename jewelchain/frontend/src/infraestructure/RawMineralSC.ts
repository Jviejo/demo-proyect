import { IJewelChainRequest, IJewelChainResponse, JewelOrderResponse } from "@/domain/raw-mineral/RawMineral";
import { IJewelChain } from "./IJewelChain";
import { BrowserProvider, TransactionReceipt, TransactionResponse } from "ethers";
import { Contract } from "ethers";
import { RAW_MINERAL_ABI } from "@/abis/raw-mineral";


export class RawMineralSC implements IJewelChain {

  private provider: BrowserProvider;

  constructor(provider: BrowserProvider) {
    this.provider = provider;
  }

  async createJewelRecord(jewelRawMineral: IJewelChainRequest): Promise<TransactionReceipt> {
    const contract: Contract = await this.getContractRawMineal();
    const gasEstimate: bigint = await contract.createJewelRecord.estimateGas(jewelRawMineral.name, jewelRawMineral.date, jewelRawMineral.quantity, jewelRawMineral.data);

    const rawMineralCreate: TransactionResponse = await contract.createJewelRecord(jewelRawMineral.name, jewelRawMineral.date, jewelRawMineral.quantity, jewelRawMineral.data, { gasLimit: gasEstimate });
    const rawMineralTransaction: TransactionReceipt | null = await rawMineralCreate.wait();
    if (rawMineralTransaction == null) {
      throw Error('Transaction failed');
    }
    return rawMineralTransaction;
  }

  async getJewelRecordBySupplier(providerAddress: string): Promise<IJewelChainResponse[]> {
    const contract: Contract = await this.getContractRawMineal();
    const rawMineral: IJewelChainResponse[] = await contract.getJewelRecordBySupplier(providerAddress);
    return rawMineral;
  }

  async orderMaterial(provider: string, uniqueId: string, quantity: number): Promise<TransactionReceipt> {
    const contract: Contract = await this.getContractRawMineal();
    const gasEstimate: bigint = await contract.orderMaterial.estimateGas(provider, uniqueId, quantity);
    const rawMineralOrder: TransactionResponse = await contract.orderMaterial(provider, uniqueId, quantity, { gasLimit: gasEstimate });
    const rawMineralTransaction: TransactionReceipt | null = await rawMineralOrder.wait();
    if (rawMineralTransaction == null) {
      throw Error('Transaction failed');
    }
    return rawMineralTransaction;
  }

  async getJewelOrder(): Promise<JewelOrderResponse[]> {
    const contract: Contract = await this.getContractRawMineal();
    const jewelOrder: JewelOrderResponse[] = await contract.getOrderMaterialList();
    return jewelOrder;
  }
  async getJewelSupplierByIndex(uniqueId: string): Promise<IJewelChainResponse> {
    const contract: Contract = await this.getContractRawMineal();
    const jewel: IJewelChainResponse = await contract.getJewelByUniqueId(uniqueId);
    return jewel;
  }

  async sendMaterial(uniqueId: string, indexOrder: number): Promise<TransactionReceipt> {

    const contract: Contract = await this.getContractRawMineal();
    const gasEstimate: bigint = await contract.sendMaterial.estimateGas(uniqueId, indexOrder);
    const sendJewels: TransactionResponse = await contract.sendMaterial(uniqueId, indexOrder, { gasLimit: gasEstimate });
    const sendJewelsTransaction: TransactionReceipt | null = await sendJewels.wait();
    if (sendJewelsTransaction == null) {
      throw Error('Transaction failed');
    }
    return sendJewelsTransaction;
  }

  async getJewelChainByBytes(jewelData: string): Promise<IJewelChainResponse> {
    const contract: Contract = await this.getContractRawMineal();
    const jewelRecord: IJewelChainResponse = await contract.decodeJewel(jewelData);
    return jewelRecord;
  }

  async getContractRawMineal(): Promise<Contract> {
    const signer = await this.provider.getSigner();
    const ADDRESS = process.env.NEXT_PUBLIC_RAW_MINERAL_CONTRACT_ADDRESS as string;
    if (!ADDRESS) throw new Error("La dirección del rawMineralContract no está definida");
    return new Contract(ADDRESS, RAW_MINERAL_ABI, signer)
  }

}