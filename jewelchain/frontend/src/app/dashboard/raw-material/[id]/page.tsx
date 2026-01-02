"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/dateUtils";
import { useRawMineralService } from "@/hooks/raw-mineral/useRawMineral";
import { useEffect, useState } from "react";
import { RawMineralChain } from "@/domain/raw-mineral/RawMineral";

export default function RawMineralDetails({ params }: { params: { id: string } }) {
  const { user, provider } = useAuth();
  const router = useRouter();
  const [mineralDetails, setMineralDetails] = useState<RawMineralChain | null>(null);

  const {
    rawMineralList,
    isLoading,
    error,
    getAllRawMineral
  } = useRawMineralService(provider);

  useEffect(() => {
    if (user?.address) {
      getAllRawMineral(user.address);
    }
  }, [user?.address, getAllRawMineral]);

  useEffect(() => {
    if (rawMineralList) {
      const mineral = rawMineralList.find(m => m.uniqueId === params.id);
      if (mineral) {
        setMineralDetails(mineral);
      }
    }
  }, [rawMineralList, params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!mineralDetails) {
    return <div className="alert alert-warning">No se encontró el mineral</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalles del Mineral #{params.id}</h1>
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
              <p><span className="font-bold">ID:</span> {mineralDetails.uniqueId}</p>
              <p><span className="font-bold">Nombre:</span> {mineralDetails.name}</p>
              <p><span className="font-bold">Fecha:</span> {formatDate(new Date(Number(mineralDetails.date)))}</p>
              <p><span className="font-bold">Proveedor:</span> {mineralDetails.supplier}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Características</h2>
            <div className="space-y-2">
              <p><span className="font-bold">Cantidad:</span> {mineralDetails.quantity}</p>
              <p>
                <span className="font-bold">Calidad:</span>
                <span className={`badge ${getQualityBadgeColor(mineralDetails.quality)} ml-2`}>
                  {mineralDetails.quality}%
                </span>
              </p>
              <p><span className="font-bold">Origen:</span> {mineralDetails.origin}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getQualityBadgeColor(quality: number): string {
  if (quality >= 90) return "badge-success";
  if (quality >= 70) return "badge-info";
  if (quality >= 50) return "badge-warning";
  return "badge-error";
} 