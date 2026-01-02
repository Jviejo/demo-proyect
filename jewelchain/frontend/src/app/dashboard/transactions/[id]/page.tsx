"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/dateUtils";
import { TransactionDetail } from "@/types/transaction";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function TransactionDetails({ params }: { params: { id: string } }) {
  // const { user } = useAuth();
  const router = useRouter();

  // TODO: Reemplazar con datos reales
  const transactionDetails: TransactionDetail = {
    id: params.id,
    date: new Date("2024-02-20T10:30:00"),
    type: "COMPRA",
    quantity: 100,
    product: "Oro 18k",
    origin: "Proveedor A",
    destination: "Almacén Central",
    status: "Confirmada",
    blockchainHash: "0x1234...5678",
    items: [
      {
        id: "ITEM-001",
        productName: "Oro 18k",
        quantity: 50,
        unit: "gramos",
        price: 45.5
      },
      {
        id: "ITEM-002",
        productName: "Plata 925",
        quantity: 50,
        unit: "gramos",
        price: 0.75
      }
    ],
    additionalInfo: {
      orderReference: "PO-001",
      notes: "Entrega programada para la mañana"
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalles de Transacción #{params.id}</h1>
        <button 
          onClick={() => router.back()} 
          className="btn btn-outline"
        >
          Volver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Información General</h2>
            <div className="space-y-2">
              <p><span className="font-bold">Fecha:</span> {formatDate(transactionDetails.date)}</p>
              <p><span className="font-bold">Tipo:</span> {transactionDetails.type}</p>
              <p><span className="font-bold">Estado:</span> {transactionDetails.status}</p>
              <p><span className="font-bold">Origen:</span> {transactionDetails.origin}</p>
              <p><span className="font-bold">Destino:</span> {transactionDetails.destination}</p>
              <p>
                <span className="font-bold">Hash Blockchain:</span>
                <a 
                  href={`https://etherscan.io/tx/${transactionDetails.blockchainHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary ml-2"
                >
                  {transactionDetails.blockchainHash}
                  <FaExternalLinkAlt className="w-3 h-3 ml-1 inline" />
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Información Adicional</h2>
            <div className="space-y-2">
              <p><span className="font-bold">Referencia de Orden:</span> {transactionDetails.additionalInfo?.orderReference}</p>
              <p><span className="font-bold">Notas:</span> {transactionDetails.additionalInfo?.notes}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Detalle de Items</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {transactionDetails.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 