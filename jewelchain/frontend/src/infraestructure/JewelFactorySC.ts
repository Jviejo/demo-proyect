import { BrowserProvider, Contract, ethers } from "ethers";
import { IJewelFactory, MaterialInventory, Jewel, CreateJewelDTO, JewelMaterial } from "./IJewelFactory";
import { JEWEL_FACTORY_ABI } from "@/abis/jewel-factory";

export class JewelFactorySC implements IJewelFactory {
  private provider: BrowserProvider;

  constructor(provider: BrowserProvider) {
    this.provider = provider;
  }

  private async getContract(): Promise<Contract> {
    const signer = await this.provider.getSigner();
    return new Contract(
      process.env.NEXT_PUBLIC_JEWEL_FACTORY_CONTRACT_ADDRESS!,
      JEWEL_FACTORY_ABI,
      signer
    );
  }

  async getAllMaterialsInventory(): Promise<MaterialInventory[]> {
    const contract = await this.getContract();
    const [ids, inventories] = await contract.getAllMaterialsInventory();
    return inventories.map((inventory: MaterialInventory, index: number) => ({
      materialId: ids[index],
      quantity: Number(inventory.quantity),
      supplier: inventory.supplier
    }));
  }

  async getAllJewels(): Promise<Jewel[]> {
    const contract = await this.getContract();
    const jewels = await contract.getAllJewels();
    
    return jewels.map((jewel: Jewel) => {
        let decodedData = {
            quality: 0,
            design: "",
            certification: ""
        };

        try {
            const data = jewel.data as unknown;
            if (typeof data === 'string' && data.startsWith('0x')) {
                const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
                    ["uint256", "string", "string"],
                    data
                );
                
                decodedData = {
                    quality: Number(decoded[0]),
                    design: decoded[1],
                    certification: decoded[2]
                };
            }
        } catch (error) {
            console.error("Error decodificando datos técnicos:", error);
        }

        return {
            tokenId: Number(jewel.tokenId),
            name: ethers.decodeBytes32String(jewel.name),
            creationDate: Number(jewel.creationDate),
            creator: jewel.creator,
            materials: jewel.materials.map((m: JewelMaterial) => ({
                materialId: m.materialId,
                quantity: Number(m.quantity)
            })),
            data: decodedData,
            ownershipHistory: jewel.ownershipHistory,
            totalSupply: Number(jewel.totalSupply)
        };
    });
  }

  async createJewel(jewelData: CreateJewelDTO): Promise<number> {
    try {
      const contract = await this.getContract();
      
      // Convertir el nombre a bytes32
      const nameBytes = ethers.encodeBytes32String(jewelData.name);
      
      // Preparar los datos adicionales
      const data = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "string", "string"],
        [jewelData.data.quality, jewelData.data.design, jewelData.data.certification]
      );

      // Estimar el gas antes de la transacción
      const gasEstimate = await contract.createJewel.estimateGas(
        nameBytes,
        jewelData.quantity,
        jewelData.materials,
        data
      );

      // Ejecutar la transacción con el gas estimado
      const transaction = await contract.createJewel(
        nameBytes,
        jewelData.quantity,
        jewelData.materials,
        data,
        { gasLimit: gasEstimate }
      );

      // Esperar a que la transacción se confirme
      const receipt = await transaction.wait();

      // Buscar el evento de creación de joya en el recibo
      const event = receipt.logs[0]; // Asumiendo que el evento que nos interesa es el primero
      const tokenId = Number(event.topics[1]); // El tokenId debería estar en el primer topic después del identificador del evento

      return tokenId;
    } catch (error) {
      console.error("Error en createJewel:", error);
      throw new Error(error instanceof Error ? error.message : 'Error desconocido al crear la joya');
    }
  }
} 