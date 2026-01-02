"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/utils/dateUtils";
import { JewelOrder } from "@/domain/raw-mineral/RawMineral";
import { useEffect, useState } from "react";
import { useRawMineralOrders } from "@/hooks/raw-mineral/useRawMineralOrders";
import { useAuth } from "@/context/AuthContext";
import { ButtonLoading } from "@/components/button/ButtonLoading";
import { useUserService } from "@/hooks/user/useUserService";

const mapPrice: Record<string, number> = {
  Diamante: 100,
  Oro: 150,
  Plata: 75,
  Zafiro: 90,
  Rubi: 85,
};

export default function SalesOrderDetails() {
  const { provider } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, sendMaterial } = useRawMineralOrders(provider);
  const { getUserName } = useUserService(provider);
  const [orderJewel, setOrderJewel] = useState<JewelOrder | null>(null);
  const [clientName, setClientName] = useState<string>("");

  useEffect(() => {
    const order = searchParams.get("order");
    setOrderJewel(order ? JSON.parse(order) : null);
  }, [searchParams]);

  useEffect(() => {
    const fetchClientName = async () => {
      if (orderJewel?.to) {
        const name = await getUserName(orderJewel.to);
        if (name) setClientName(name);
      }
    };
    fetchClientName();
  }, [orderJewel, getUserName]);

  const handlerClick = async () => {
    if (orderJewel) {
      await sendMaterial(orderJewel.uniqueId, orderJewel.index);
      router.back();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Detalles de Orden de Venta #{orderJewel?.uniqueId}
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
                {orderJewel
                  ? formatDate(new Date(Number(orderJewel.date)))
                  : "-"}
              </p>
              <p>
                <span className="font-bold">Cliente:</span>{" "}
                {clientName ? (
                  <>
                    {clientName} <span className="text-sm text-gray-500">({orderJewel?.to})</span>
                  </>
                ) : (
                  orderJewel?.to
                )}
              </p>
              <p>
                <span className="font-bold">Estado:</span> Pendiente{" "}
              </p>
              <p>
                <span className="font-bold">Método de Pago:</span> Crypto
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body justify-between">
            <h2 className="card-title">Resumen</h2>
            <div className="space-y-2">
              <p>
                <span className="font-bold">Cantidad Total:</span>{" "}
                {orderJewel?.quantity}
              </p>
              <p>
                <span className="font-bold">Valor Total:</span> $
                {orderJewel
                  ? (
                      (orderJewel.quantity as number) *
                      priceJewels(orderJewel.name)
                    ).toFixed(2)
                  : 0}
              </p>
            </div>
            <ButtonLoading
              isLoading={isLoading}
              handelerClick={handlerClick}
              label={"Vender"}
            />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Detalle de Productos</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{orderJewel?.name}</td>
                  <td>{orderJewel?.quantity}</td>
                  <td>
                    ${orderJewel ? priceJewels(orderJewel.name).toFixed(2) : 0}
                  </td>
                  <td>
                    $
                    {orderJewel
                      ? (
                          (orderJewel.quantity as number) *
                          priceJewels(orderJewel.name)
                        ).toFixed(2)
                      : 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const priceJewels = (name: string): number => {
  const imgSrc: number | undefined = mapPrice[name];

  return imgSrc === undefined ? 0 : imgSrc;
};
