export interface MaterialInventory {
  materialId: string;
  quantity: number;
  supplier: string;
}

export interface JewelMaterial {
  materialId: string;
  quantity: number;
}

export interface Jewel {
  tokenId: number;
  name: string;
  creationDate: number;
  creator: string;
  materials: JewelMaterial[];
  data: {
    quality: number;
    design: string;
    certification: string;
  };
  ownershipHistory: string[];
  totalSupply: number;
}

export interface CreateJewelDTO {
  name: string;
  quantity: number;
  materials: JewelMaterial[];
  data: {
    quality: number;
    design: string;
    certification: string;
  };
}

export interface IJewelFactory {
  getAllMaterialsInventory(): Promise<MaterialInventory[]>;
  getAllJewels(): Promise<Jewel[]>;
  createJewel(jewel: CreateJewelDTO): Promise<number>;
} 