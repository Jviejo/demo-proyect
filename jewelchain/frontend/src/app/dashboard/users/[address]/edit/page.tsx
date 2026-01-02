"use client";

import { useAuthorization } from "@/hooks/useAuthorization";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, UserRole } from "@/types/user";
import { getRoleLabel } from "@/utils/roleUtils";

export default function EditUser({ params }: { params: { address: string } }) {
  const router = useRouter();
  const isAuthorized = useAuthorization(["ADMIN_ROLE"]);

  const [formData, setFormData] = useState<User>({
    address: params.address,
    name: "",
    role: "STORE_ROLE",
    isActive: true
  });

  const roles: UserRole[] = [
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE"
  ];

  useEffect(() => {
    // TODO: Cargar datos del usuario desde el smart contract
    const loadUserData = async () => {
      // Simulación de carga de datos
      setFormData({
        address: params.address,
        name: "Usuario Ejemplo",
        role: "STORE_ROLE",
        isActive: true
      });
    };

    loadUserData();
  }, [params.address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar la lógica de actualización con el smart contract
    console.log("Actualizar usuario:", formData);
    router.push("/dashboard/users");
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editar Usuario</h1>
        <button 
          onClick={() => router.back()} 
          className="btn btn-outline"
        >
          Cancelar
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Dirección de Wallet</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.address}
                disabled
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Nombre del usuario"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Rol</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                required
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Usuario Activo</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}