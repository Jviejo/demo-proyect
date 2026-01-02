export interface PurchaseOrder {
  id: string;
  creationDate: Date;
  supplier: string;
  materials: string;
  totalQuantity: number;
  status: string;
  estimatedDeliveryDate: Date;
}

export interface PurchaseOrderDetail extends PurchaseOrder {
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  materialName: string;
  quantity: number;
  unit: string;
  price: number;
} 