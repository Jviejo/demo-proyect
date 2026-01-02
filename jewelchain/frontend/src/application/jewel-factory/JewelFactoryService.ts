import { BrowserProvider } from "ethers";
import { JewelFactorySC } from "@/infraestructure/JewelFactorySC";
import { MaterialInventory, Jewel, CreateJewelDTO } from "@/infraestructure/IJewelFactory";

export class JewelFactoryService {
  private jewelFactorySC: JewelFactorySC;

  constructor(provider: BrowserProvider) {
    this.jewelFactorySC = new JewelFactorySC(provider);
  }

  async getAllMaterialsInventory(): Promise<MaterialInventory[]> {
    try {
      return await this.jewelFactorySC.getAllMaterialsInventory();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error desconocido al obtener el inventario');
    }
  }

  async getAllJewels(): Promise<Jewel[]> {
    try {
      return await this.jewelFactorySC.getAllJewels();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error desconocido al obtener las joyas');
    }
  }

  async createJewel(jewelData: CreateJewelDTO): Promise<number> {
    try {
      if (!jewelData.name) {
        throw new Error('El nombre de la joya es requerido');
      }
      if (jewelData.quantity <= 0) {
        throw new Error('La cantidad debe ser mayor que 0');
      }
      if (!jewelData.materials || jewelData.materials.length === 0) {
        throw new Error('Se requiere al menos un material');
      }

      const tokenId = await this.jewelFactorySC.createJewel(jewelData);
      return tokenId;
    } catch (error) {
      console.error("Error en JewelFactoryService.createJewel:", error);
      throw new Error(error instanceof Error ? error.message : 'Error desconocido al crear la joya');
    }
  }
} 