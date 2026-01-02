"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { RawMineralTable } from "@/components/RawMineral/RawMineralTable";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRawMineralService } from "@/hooks/raw-mineral/useRawMineral";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RawMaterial() {
  const router = useRouter();
  const { provider, user } = useAuth();
  const { canAccessRawMaterial, isLoading: isLoadingPermissions } =
    usePermissions();
  const [isChecking, setIsChecking] = useState(true);

  const {
    rawMineralList,
    isLoading: isLoadingMinerals,
    error,
    getAllRawMineral,
  } = useRawMineralService(provider);

  useEffect(() => {
    if (!isLoadingPermissions) {
      setIsChecking(false);
      if (!canAccessRawMaterial) {
        router.push("/unauthorized");
      } else if (user?.address) {
        getAllRawMineral(user?.address);
      }
    }
  }, [
    user,
    canAccessRawMaterial,
    isLoadingPermissions,
    router,
    getAllRawMineral,
  ]);

  if (isChecking || isLoadingPermissions) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!canAccessRawMaterial) {
    return null;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventario Minerales</h1>
        <Link href="/dashboard/raw-material/new" className="btn btn-primary">
          <FaPlus className="w-4 h-4 mr-2" />
          Nuevo Mineral
        </Link>
      </div>

      {isLoadingMinerals ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <RawMineralTable rawMineralList={rawMineralList} />
      )}
    </div>
  );
}
