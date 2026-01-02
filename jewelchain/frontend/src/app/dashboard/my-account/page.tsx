"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { FaEdit, FaCheckCircle } from "react-icons/fa";
import { getRoleBadgeColor, getRoleLabel, getRoleIcon } from "@/utils/roleUtils";
import React from "react";

export default function MyAccount() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        companyName: user.companyName || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // TODO: Implementar la actualización del perfil
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mi Cuenta</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Información Personal</h2>
              {!isEditing && (
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre de la Empresa</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Opcional"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p><span className="font-bold">Nombre:</span> {user.name}</p>
                <p><span className="font-bold">Empresa:</span> {user.companyName || "No especificado"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Información de la Cuenta */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Información de la Cuenta</h2>
            <div className="space-y-2">
              <p>
                <span className="font-bold">Dirección de Wallet:</span>
                <br />
                <code className="text-sm bg-base-200 p-1 rounded">
                  {user.address}
                </code>
              </p>
              <p>
                <span className="font-bold">Rol:</span>
                <span className={`badge ml-2 ${getRoleBadgeColor(user.role)}`}>
                  {React.createElement(getRoleIcon(user.role), { className: "w-4 h-4 mr-1" })}
                  {getRoleLabel(user.role)}
                </span>
              </p>
              <p>
                <span className="font-bold">Estado:</span>
                <span className={`badge ${user.isActive ? 'badge-success' : 'badge-error'} ml-2`}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="card bg-base-100 shadow-xl md:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Actividad Reciente</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Acción</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {/* TODO: Implementar historial de actividad real */}
                  <tr>
                    <td>{new Date().toLocaleDateString()}</td>
                    <td>Inicio de sesión</td>
                    <td>Acceso desde navegador web</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 