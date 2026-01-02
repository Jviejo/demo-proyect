"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/dateUtils";
import { LocationDetail } from "@/types/location";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function LocationDetails({ params }: { params: { id: string } }) {
  // const { user } = useAuth();
  const router = useRouter();

  // TODO: Reemplazar con datos reales
  const locationDetails: LocationDetail = {
    id: params.id,
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
    status: "ACTIVE",
    additionalInfo: {
      description: "Mina principal de extracción de oro",
      operatingHours: "Lun-Vie: 7:00-19:00",
      certifications: ["ISO 9001", "ISO 14001"],
      notes: "Última inspección de seguridad completada el 15/02/2024"
    }
  };

  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalles de Ubicación: {locationDetails.name}</h1>
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
              <p><span className="font-bold">ID:</span> {locationDetails.id}</p>
              <p><span className="font-bold">Tipo:</span> {locationDetails.type}</p>
              <p><span className="font-bold">Estado:</span> {locationDetails.status}</p>
              <p><span className="font-bold">Última Actualización:</span> {formatDate(locationDetails.lastUpdate)}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Ubicación</h2>
            <div className="space-y-2">
              <p>
                <span className="font-bold">Coordenadas:</span>
                <a
                  href={getGoogleMapsUrl(locationDetails.coordinates.latitude, locationDetails.coordinates.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary ml-2"
                >
                  {locationDetails.coordinates.latitude}, {locationDetails.coordinates.longitude}
                  <FaMapMarkerAlt className="w-3 h-3 ml-1 inline" />
                </a>
              </p>
              <p><span className="font-bold">Dirección:</span> {locationDetails.address}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Responsable</h2>
            <div className="space-y-2">
              <p><span className="font-bold">Nombre:</span> {locationDetails.responsible.name}</p>
              <p><span className="font-bold">Contacto:</span> {locationDetails.responsible.contact}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Información Adicional</h2>
            <div className="space-y-2">
              <p><span className="font-bold">Descripción:</span> {locationDetails.additionalInfo?.description}</p>
              <p><span className="font-bold">Horario:</span> {locationDetails.additionalInfo?.operatingHours}</p>
              <p><span className="font-bold">Certificaciones:</span> {locationDetails.additionalInfo?.certifications?.join(", ")}</p>
              <p><span className="font-bold">Notas:</span> {locationDetails.additionalInfo?.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 