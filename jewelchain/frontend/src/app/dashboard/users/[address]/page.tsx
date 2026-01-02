"use client";

import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { getRoleBadgeColor, getRoleLabel, getRoleIcon } from "@/utils/roleUtils";
import React from "react";

export default function UserDetails({ params }: { params: { address: string } }) {
  // const { user } = useAuth();
  const router = useRouter();

  // TODO: Reemplazar con datos reales
  const userDetails: User = {
    address: params.address,
    role: "STORE_ROLE",
    isActive: true,
    name: "Tienda Principal",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalles de Usuario</h1>
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
              <p>
                <span className="font-bold">Dirección:</span>
                <br />
                <code className="text-sm bg-base-200 p-1 rounded">
                  {userDetails.address}
                </code>
              </p>
              <p><span className="font-bold">Nombre:</span> {userDetails.name}</p>
              <p>
                <span className="font-bold">Rol:</span>
                <span className={`badge ${getRoleBadgeColor(userDetails.role)} ml-2`}>
                  {React.createElement(getRoleIcon(userDetails.role), { className: "w-4 h-4 mr-1" })}
                  {getRoleLabel(userDetails.role)}
                </span>
              </p>
              <p>
                <span className="font-bold">Estado:</span>
                <span className={`badge ${userDetails.isActive ? 'badge-success' : 'badge-error'} ml-2`}>
                  {userDetails.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Información de Contacto</h2>
            <div className="space-y-2">
              {/*<p><span className="font-bold">Email:</span> {userDetails?.additionalInfo?.email}</p>*/}
              {/*<p><span className="font-bold">Teléfono:</span> {userDetails?.additionalInfo?.phone}</p>*/}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Actividad</h2>
            <div className="space-y-2">
              {/*<p><span className="font-bold">Último Acceso:</span> {userDetails.additionalInfo?.lastLogin && formatDate(userDetails.additionalInfo.lastLogin, true)}</p>*/}
              {/*<p><span className="font-bold">Fecha de Creación:</span> {formatDate(userDetails.additionalInfo?.createdAt || new Date())}</p>*/}
              {/*<p><span className="font-bold">Última Actualización:</span> {formatDate(userDetails.additionalInfo?.updatedAt || new Date())}</p>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
