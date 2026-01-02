"use client";

import { useRouter } from "next/navigation";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <FaExclamationTriangle className="w-16 h-16 text-warning mb-4" />
          <h2 className="card-title">Acceso No Autorizado</h2>
          <p className="py-4">Tu rol de usuario no tiene los permisos necesarios para acceder a esta sección.</p>
          <div className="card-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => router.push("/dashboard")}
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 