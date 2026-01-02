"use client";

import { useAuthorization } from "@/hooks/useAuthorization";
import { UserTable } from "@/components/User/UserTable";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function Users() {
  const isAuthorized = useAuthorization(["ADMIN_ROLE"]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Link 
          href="/dashboard/users/new" 
          className="btn btn-primary"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Link>
      </div>
      <UserTable />
    </div>
  );
} 