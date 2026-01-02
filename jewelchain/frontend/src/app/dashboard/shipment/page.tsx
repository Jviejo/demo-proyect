"use client";

import { useAuthorization } from "@/hooks/useAuthorization";
import { useDistributor } from "@/hooks/distributor/useDistributor";
import { useEffect, useState } from "react";
import { ShipmentTable } from "@/components/ShipmentTable/ShipmentTable";

export default function Shipment() {
  const isAuthorized = useAuthorization(["DISTRIBUTOR_ROLE"]);
  const { shipments, listShipmentsPending } = useDistributor();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const callShipments = async () => {
      setIsLoading(true);
      await listShipmentsPending();
      setIsLoading(false);
    };

    callShipments();
  }, [listShipmentsPending]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Envíos</h1>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <ShipmentTable listShipments={shipments} />
      )}
    </div>
  );
}
