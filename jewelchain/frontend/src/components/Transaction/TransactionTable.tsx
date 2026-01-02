"use client";

import { Transaction } from "@/types/transaction";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { FaEye, FaExternalLinkAlt } from "react-icons/fa";

export function TransactionTable() {
  // TODO: Reemplazar con datos reales de tu API/Smart Contract
  const transactions: Transaction[] = [
    {
      id: "TRX-001",
      date: new Date("2024-02-20T10:30:00"),
      type: "COMPRA",
      quantity: 100,
      product: "Oro 18k",
      origin: "Proveedor A",
      destination: "Almacén Central",
      status: "Confirmada",
      blockchainHash: "0x1234...5678",
    },
    // Más transacciones...
  ];

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID Transacción</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Material/Producto</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Estado</th>
            <th>Hash</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{formatDate(transaction.date)}</td>
              <td>
                <span className={`badge ${getTypeBadgeColor(transaction.type)}`}>
                  {transaction.type}
                </span>
              </td>
              <td>{transaction.quantity}</td>
              <td>{transaction.product}</td>
              <td>{transaction.origin}</td>
              <td>{transaction.destination}</td>
              <td>
                <span className={`badge ${getStatusBadgeColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </td>
              <td>
                <a 
                  href={`https://etherscan.io/tx/${transaction.blockchainHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary flex items-center"
                >
                  {transaction.blockchainHash.slice(0, 6)}...
                  {transaction.blockchainHash.slice(-4)}
                  <FaExternalLinkAlt className="w-3 h-3 ml-1" />
                </a>
              </td>
              <td>
                <Link
                  href={`/dashboard/transactions/${transaction.id}`}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEye className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getTypeBadgeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "compra":
      return "badge-primary";
    case "venta":
      return "badge-secondary";
    case "transferencia":
      return "badge-accent";
    default:
      return "badge-ghost";
  }
}

function getStatusBadgeColor(status: string): string {
  switch (status.toLowerCase()) {
    case "confirmada":
      return "badge-success";
    case "pendiente":
      return "badge-warning";
    case "fallida":
      return "badge-error";
    default:
      return "badge-ghost";
  }
} 