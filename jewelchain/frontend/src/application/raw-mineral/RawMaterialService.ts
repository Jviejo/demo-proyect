import { IJewelChainRequest, IJewelChainResponse, JewelOrder, JewelOrderResponse, RawMineralChain, RawMineralForm, RecordType } from "@/domain/raw-mineral/RawMineral";
import { defaultAbiCoderEncode, defaultAbiCoderDecode, encodeBytes32String, decodeBytes32String, weiToUnit, unitToWei } from "../EthersUtils";
import { BrowserProvider, TransactionReceipt } from "ethers";
import { IJewelChain } from "@/infraestructure/IJewelChain";
import { RawMineralSC } from "@/infraestructure/RawMineralSC";
import { selectImgByName } from "@/utils/imagesUtils";

export class RawMineralService {
  private rawMineralSC: IJewelChain;
  constructor(provider: BrowserProvider) {
    this.rawMineralSC = new RawMineralSC(provider);
  }

  public async createRawMineral(rawMineral: RawMineralForm): Promise<string> {
    const nameBytes = encodeBytes32String(rawMineral.name);
    const dataBytes = defaultAbiCoderEncode(['uint256', 'string'], [rawMineral.quality, rawMineral.origin]);

    const jewelRawMinetal: IJewelChainRequest = {
      name: nameBytes,
      date: weiToUnit(Number(rawMineral.date)),
      quantity: weiToUnit(Number(rawMineral.quantity)),
      data: dataBytes,
    };

    const tx: TransactionReceipt = await this.rawMineralSC.createJewelRecord(jewelRawMinetal);
    return tx.hash;
  }

  public async getJewelRecordBySupplier(addressSuplier: string): Promise<RawMineralChain[]> {
    const rawMineralFromSC: IJewelChainResponse[] = await this.rawMineralSC.getJewelRecordBySupplier(addressSuplier);

    const rawMineral: RawMineralChain[] = rawMineralFromSC.map(mineral => {
      const [quality, origin] = defaultAbiCoderDecode(['uint256', 'string'], mineral.data);
      const name: string = decodeBytes32String(mineral.name);
      return {
        supplier: mineral.supplier,
        uniqueId: mineral.uniqueId,
        name,
        date: unitToWei(Number(mineral.date)),
        quantity: unitToWei(Number(mineral.quantity)),
        quality: Number(unitToWei(Number(quality))),
        origin: origin as string,
        recordType: RecordType.MATERIAL,
        data: mineral.data,
        img: selectImgByName(name)
      }
    });

    return rawMineral;
  }

  public async orderMaterial(provider: string, uniqueId: string, quantity: number): Promise<string> {
    const tx: TransactionReceipt = await this.rawMineralSC.orderMaterial(provider, uniqueId, quantity);
    return tx.hash;
  }

  public async getOrderPending(): Promise<JewelOrder[]> {

    const jewelOrderResponses: JewelOrderResponse[] = await this.rawMineralSC.getJewelOrder();

    const results = await Promise.allSettled(
      jewelOrderResponses.map(async (jewelOrderResponse) => {
        const mineral = await this.rawMineralSC.getJewelSupplierByIndex(jewelOrderResponse.uniqueId);

        const parsedMineral: RawMineralChain = this.parseJewelRaw(mineral);
        const jewelOrderResponseC: JewelOrderResponse = {
          to: jewelOrderResponse.to,
          uniqueId: jewelOrderResponse.uniqueId,
          index: Number(unitToWei(Number(jewelOrderResponse.index))),
          quantity: Number(unitToWei(Number(jewelOrderResponse.quantity)))
        };
        return {
          ...parsedMineral,
          ...jewelOrderResponseC,
          
        };
      })
    );
    const successfulOrders: JewelOrder[] = results
      .filter((result): result is PromiseFulfilledResult<JewelOrder> => result.status === 'fulfilled')
      .map((result) => result.value);

    return successfulOrders;
  }

  public async sendMaterial(uniqueId: string, indexOrder: number): Promise<string> {
    const tx: TransactionReceipt = await this.rawMineralSC.sendMaterial(uniqueId, indexOrder);
    return tx.hash;
  }

  private parseJewelRaw(mineral: IJewelChainResponse): RawMineralChain {
    const [quality, origin] = defaultAbiCoderDecode(['uint256', 'string'], mineral.data);
    const name: string = decodeBytes32String(mineral.name);

    const parsedMineral: RawMineralChain = {
      supplier: mineral.supplier,
      uniqueId: mineral.uniqueId,
      name,
      date: unitToWei(Number(mineral.date)),
      quantity: unitToWei(Number(mineral.quantity)),
      quality: Number(unitToWei(Number(quality))),
      origin: origin as string,
      recordType: RecordType.MATERIAL,
      data: mineral.data,
      img: selectImgByName(name),
    };
    return parsedMineral;
  }

}