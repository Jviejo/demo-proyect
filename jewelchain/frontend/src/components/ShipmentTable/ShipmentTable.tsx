"use client";

import { Shipment } from "@/domain/distributor/Distributor";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { TruncateItem } from "../truncate/TruncateItem";
import { useUserService } from "@/hooks/user/useUserService";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

interface ShipmentTableProps {
  listShipments: Shipment[];
}

export function ShipmentTable({ listShipments }: ShipmentTableProps) {
  const { provider } = useAuth();
  const { getUserName } = useUserService(provider);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  const deliveryDate = (date: number): Date => {
    const newDate = new Date(date);
    return new Date(newDate.setDate(newDate.getDate() + 2));
  };

  useEffect(() => {
    const fetchUserNames = async () => {
      const names: Record<string, string> = {};
      for (const shipment of listShipments) {
        if (!names[shipment.supplier]) {
          const supplierName = await getUserName(shipment.supplier);
          if (supplierName) names[shipment.supplier] = supplierName;
        }
        if (!names[shipment.receiver]) {
          const receiverName = await getUserName(shipment.receiver);
          if (receiverName) names[shipment.receiver] = receiverName;
        }
      }
      setUserNames(names);
    };

    fetchUserNames();
  }, [listShipments, getUserName]);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID Orden</th>
            <th>Proveedor</th>
            <th>Entrega</th>
            <th>Fecha Creación</th>

            <th>Materiales</th>
            <th>Cantidad Total</th>
            <th>Fecha Recepción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listShipments.map((order) => (
            <tr key={order.trackingId}>
              <td>
                <TruncateItem item={order.trackingId} />
              </td>
              <td>
                {userNames[order.supplier] ? (
                  <>
                    {userNames[order.supplier]}{" "}
                    <span className="text-sm text-gray-500">
                      ({order.supplier})
                    </span>
                  </>
                ) : (
                  order.supplier
                )}

              </td>
              <td>
                {userNames[order.receiver] ? (
                  <>
                    {userNames[order.receiver]}{" "}
                    <span className="text-sm text-gray-500">
                      ({order.receiver})
                    </span>
                  </>
                ) : (
                  order.receiver
                )}
              </td>
              <td>{formatDate(new Date(order.date))}</td>

              <td>{order.name}</td>
              <td>{order.quantity}</td>
              <td>{formatDate(deliveryDate(order.date))}</td>
              <td className="space-x-2">
                <Link
                  href={{
                    pathname: `/dashboard/shipment/${order.trackingId}`,
                    query: { delivery: JSON.stringify(order) },
                  }}
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
