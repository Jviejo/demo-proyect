export interface SalesOrder {
  id: string;
  creationDate: Date;
  customer: string;
  products: string;
  totalQuantity: number;
  status: string;
  paymentMethod: string;
}

export interface SalesOrderDetail extends SalesOrder {
  items: SalesOrderItem[];
}

export interface SalesOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
} 