export interface Transaction {
  id: string;
  date: Date;
  type: 'COMPRA' | 'VENTA' | 'TRANSFERENCIA';
  quantity: number;
  product: string;
  origin: string;
  destination: string;
  status: string;
  blockchainHash: string;
}

export interface TransactionDetail extends Transaction {
  items: TransactionItem[];
  additionalInfo?: {
    orderReference?: string;
    notes?: string;
    attachments?: string[];
  };
}

export interface TransactionItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
} 