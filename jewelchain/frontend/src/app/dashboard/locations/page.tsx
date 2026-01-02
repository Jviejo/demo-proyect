"use client";

import { useAuthorization } from "@/hooks/useAuthorization";
import { LocationTable } from "@/components/Location/LocationTable";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function Locations() {
  const isAuthorized = useAuthorization([
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE"
  ]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ubicaciones</h1>
        <Link 
          href="/dashboard/locations/new" 
          className="btn btn-primary"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Nueva Ubicación
        </Link>
      </div>
      <LocationTable />
    </div>
  );
} 