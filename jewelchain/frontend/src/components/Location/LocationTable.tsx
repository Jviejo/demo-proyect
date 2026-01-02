"use client";

import { Location, LocationType, LocationStatus } from "@/types/location";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { FaEye, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";

export function LocationTable() {
  // TODO: Reemplazar con datos reales de tu API/Smart Contract
  const locations: Location[] = [
    {
      id: "LOC-001",
      name: "Mina de Oro Las Américas",
      type: "MINE",
      coordinates: {
        latitude: -12.0464,
        longitude: -77.0428
      },
      address: "Av. Principal 123, Región Minera, País",
      responsible: {
        name: "Juan Pérez",
        contact: "+51 999 888 777"
      },
      lastUpdate: new Date("2024-02-20T15:30:00"),
      status: "ACTIVE"
    },
    // Más ubicaciones...
  ];

  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Ubicación</th>
            <th>Dirección</th>
            <th>Responsable</th>
            <th>Última Actualización</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td>{location.id}</td>
              <td>{location.name}</td>
              <td>
                <span className={`badge ${getTypeBadgeColor(location.type)}`}>
                  {getTypeLabel(location.type)}
                </span>
              </td>
              <td>
                <div className="flex items-center space-x-2">
                  <span>{location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}</span>
                  <a
                    href={getGoogleMapsUrl(location.coordinates.latitude, location.coordinates.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xs btn-ghost"
                  >
                    <FaMapMarkerAlt className="w-3 h-3" />
                  </a>
                </div>
              </td>
              <td>{location.address}</td>
              <td>
                <div>
                  <div>{location.responsible.name}</div>
                  <div className="text-sm opacity-60">{location.responsible.contact}</div>
                </div>
              </td>
              <td>{formatDate(location.lastUpdate)}</td>
              <td>
                <span className={`badge ${getStatusBadgeColor(location.status)}`}>
                  {getStatusLabel(location.status)}
                </span>
              </td>
              <td className="space-x-2">
                <Link
                  href={`/dashboard/locations/${location.id}`}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/locations/${location.id}/edit`}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEdit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {/* TODO: Implementar eliminación */}}
                  className="btn btn-sm btn-ghost text-error"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getTypeBadgeColor(type: LocationType): string {
  switch (type) {
    case "MINE":
      return "badge-primary";
    case "FACTORY":
      return "badge-secondary";
    case "STORE":
      return "badge-accent";
    case "DISTRIBUTOR":
      return "badge-info";
    case "CUSTOMER":
      return "badge-success";
    default:
      return "badge-ghost";
  }
}

function getStatusBadgeColor(status: LocationStatus): string {
  switch (status) {
    case "ACTIVE":
      return "badge-success";
    case "INACTIVE":
      return "badge-error";
    case "MAINTENANCE":
      return "badge-warning";
    default:
      return "badge-ghost";
  }
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