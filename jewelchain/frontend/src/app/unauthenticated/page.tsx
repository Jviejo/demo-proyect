"use client";

import { useRouter } from "next/navigation";
import { FaWallet, FaArrowLeft } from "react-icons/fa";

export default function Unauthenticated() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <FaWallet className="w-16 h-16 text-warning mb-4" />
          <h2 className="card-title">Wallet No Conectada</h2>
          <p className="py-4">Necesitas conectar tu wallet de MetaMask para acceder a la aplicación.</p>
          <div className="card-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => router.push("/")}
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Conectar Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 