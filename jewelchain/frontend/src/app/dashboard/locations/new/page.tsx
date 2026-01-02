"use client";

import { useAuthorization } from "@/hooks/useAuthorization";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocationType, LocationStatus } from "@/types/location";

export default function NewLocation() {
  const router = useRouter();
  const isAuthorized = useAuthorization([
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE"
  ]);

  const [formData, setFormData] = useState({
    name: "",
    type: "STORE" as LocationType,
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    address: "",
    responsible: {
      name: "",
      contact: ""
    },
    status: "ACTIVE" as LocationStatus,
    additionalInfo: {
      description: "",
      operatingHours: "",
      certifications: "",
      notes: ""
    }
  });

  const locationTypes: LocationType[] = [
    "MINE",
    "FACTORY",
    "STORE",
    "DISTRIBUTOR",
    "CUSTOMER"
  ];

  const locationStatuses: LocationStatus[] = [
    "ACTIVE",
    "INACTIVE",
    "MAINTENANCE"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar la lógica de creación
    console.log("Crear ubicación:", formData);
    router.push("/dashboard/locations");
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crear Nueva Ubicación</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Información básica */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre de la Ubicación</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Nombre de la ubicación"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tipo de Ubicación</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as LocationType})}
                  required
                >
                  {locationTypes.map((type) => (
                    <option key={type} value={type}>
                      {getTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coordenadas */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Latitud</span>
                </label>
                <input
                  type="number"
                  step="any"
                  className="input input-bordered"
                  value={formData.coordinates.latitude}
                  onChange={(e) => setFormData({
                    ...formData,
                    coordinates: {
                      ...formData.coordinates,
                      latitude: parseFloat(e.target.value)
                    }
                  })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Longitud</span>
                </label>
                <input
                  type="number"
                  step="any"
                  className="input input-bordered"
                  value={formData.coordinates.longitude}
                  onChange={(e) => setFormData({
                    ...formData,
                    coordinates: {
                      ...formData.coordinates,
                      longitude: parseFloat(e.target.value)
                    }
                  })}
                  required
                />
              </div>

              {/* Dirección y Estado */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Dirección Física</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  placeholder="Dirección completa"
                />
              </div>

              {/* Responsable */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre del Responsable</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.responsible.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    responsible: {
                      ...formData.responsible,
                      name: e.target.value
                    }
                  })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contacto del Responsable</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.responsible.contact}
                  onChange={(e) => setFormData({
                    ...formData,
                    responsible: {
                      ...formData.responsible,
                      contact: e.target.value
                    }
                  })}
                  required
                />
              </div>

              {/* Estado */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Estado</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as LocationStatus})}
                  required
                >
                  {locationStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Información Adicional */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Descripción</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={formData.additionalInfo.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalInfo: {
                      ...formData.additionalInfo,
                      description: e.target.value
                    }
                  })}
                  placeholder="Descripción detallada de la ubicación"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Horario de Operación</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.additionalInfo.operatingHours}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalInfo: {
                      ...formData.additionalInfo,
                      operatingHours: e.target.value
                    }
                  })}
                  placeholder="Ej: Lun-Vie: 9:00-18:00"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Certificaciones</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.additionalInfo.certifications}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalInfo: {
                      ...formData.additionalInfo,
                      certifications: e.target.value
                    }
                  })}
                  placeholder="Ej: ISO 9001, ISO 14001"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button type="submit" className="btn btn-primary">
                Crear Ubicación
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function getTypeLabel(type: LocationType): string {
  const labels = {
    MINE: "Mina",
    FACTORY: "Fábrica",
    STORE: "Tienda",
    DISTRIBUTOR: "Distribuidor",
    CUSTOMER: "Cliente"
  };
  return labels[type];
}

function getStatusLabel(status: LocationStatus): string {
  const labels = {
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
    MAINTENANCE: "En Mantenimiento"
  };
  return labels[status];
} 