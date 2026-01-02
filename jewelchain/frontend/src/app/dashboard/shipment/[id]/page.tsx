"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/utils/dateUtils";
import { useEffect, useState } from "react";
import { useDistributor } from "@/hooks/distributor/useDistributor";
import { useAuth } from "@/context/AuthContext";
import { ButtonLoading } from "@/components/button/ButtonLoading";
import { useUserService } from "@/hooks/user/useUserService";
import { Shipment } from "@/domain/distributor/Distributor";

const mapPrice: Record<string, number> = {
  Diamante: 30,
  Oro: 15,
  Plata: 7,
  Zafiro: 9,
  Rubi: 8,
};

export default function PurchaseOrderDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, confirmDelivery } = useDistributor();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [supplierName, setSupplierName] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");
  const { provider } = useAuth();
  const { getUserName } = useUserService(provider);

  useEffect(() => {
    const order = searchParams.get("delivery");
    setShipment(order ? JSON.parse(order) : null);
  }, [searchParams]);

  useEffect(() => {
    const fetchNames = async () => {
      if (shipment) {
        const supplierFullName = await getUserName(shipment.supplier);
        const receiverFullName = await getUserName(shipment.receiver);
        if (supplierFullName) setSupplierName(supplierFullName);
        if (receiverFullName) setReceiverName(receiverFullName);
      }
    };
    fetchNames();
  }, [shipment, getUserName]);

  const handlerClick = async () => {
    if (shipment) {
      await confirmDelivery(shipment.trackingId);
      router.back();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Detalles de Orden de Compra #{shipment?.trackingId}
        </h1>
        <button onClick={() => router.back()} className="btn btn-outline">
          Volver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Información General</h2>
            <div className="space-y-2">
              <p>
                <span className="font-bold">Fecha de Creación:</span>{" "}
                {shipment ? formatDate(new Date(Number(shipment.date))) : "-"}
              </p>
              <p>
                <span className="font-bold">Proveedor:</span>{" "}
                {supplierName ? (
                  <>
                    {supplierName}{" "}
                    <span className="text-sm text-gray-500">
                      ({shipment?.supplier})
                    </span>
                  </>
                ) : (
                  shipment?.supplier
                )}
              </p>
              <p>
                <span className="font-bold">Destinatario:</span>{" "}
                {receiverName ? (
                  <>
                    {receiverName}{" "}
                    <span className="text-sm text-gray-500">
                      ({shipment?.receiver})
                    </span>
                  </>
                ) : (
                  shipment?.receiver
                )}
              </p>
              <p>
                <span className="font-bold">Fecha de Recepción:</span>{" "}
                {shipment && shipment.deliveryDate
                  ? formatDate(new Date(Number(shipment.deliveryDate)))
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Resumen</h2>
            <div className="space-y-2">
              <p>
                <span className="font-bold">Cantidad Total:</span>{" "}
                {shipment?.quantity}
              </p>
              <p>
                <span className="font-bold">Valor Total:</span> $
                {shipment
                  ? (
                      (shipment.quantity as number) *
                      priceDelivery(shipment.name)
                    ).toFixed(2)
                  : 0}
              </p>
            </div>
            <ButtonLoading
              isLoading={isLoading}
              handelerClick={handlerClick}
              label={"Entregar"}
            />
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
                  <th>Material</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{shipment?.name}</td>
                  <td>{shipment?.quantity}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const priceDelivery = (name: string): number => {
  const imgSrc: number | undefined = mapPrice[name];

  return imgSrc === undefined ? 0 : imgSrc;
};
