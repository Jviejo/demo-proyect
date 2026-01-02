"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRawMineralService } from "@/hooks/raw-mineral/useRawMineral";
import { RawMineralForm } from "@/domain/raw-mineral/RawMineral";
import { InputForm } from "@/components/input/InputFrom";
import { SelectForm } from "@/components/input/SelectFrom";

export default function NewRawMineral() {
  const { provider } = useAuth();
  const router = useRouter();
  const { createRawMineral, isLoading, error } = useRawMineralService(provider);

  const [formData, setFormData] = useState<RawMineralForm>({
    name: "",
    date: Date.now(),
    quantity: 0,
    quality: 0,
    origin: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRawMineral(formData);
      router.push("/dashboard/raw-material");
    } catch (err) {
      console.error("Error al crear el mineral:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nuevo Mineral</h1>
        <button onClick={() => router.back()} className="btn btn-outline">
          Volver
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="alert alert-error">{error}</div>}

            <SelectForm
              label="Mineral"
              name="mineral"
              options={[
                { value: "Oro", label: "Oro" },
                { value: "Diamante", label: "Diamante" },
                { value: "Zafiro", label: "Zafiro" },
                { value: "Rubi", label: "Rubi" },
                { value: "Plata", label: "Plata" },
              ]}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required={true}
            />

            <InputForm
              label="Cantidad"
              type="number"
              name="quantity"
              placeholder="Cantidad"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
              required={true}
            />

            <InputForm
              label="Calidad (%)"
              type="number"
              name="quality"
              placeholder="Calidad"
              value={formData.quality}
              onChange={(e) =>
                setFormData({ ...formData, quality: Number(e.target.value) })
              }
              min={0}
              max={100}
              required={true}
            />

            <InputForm
              label="Origen"
              type="text"
              name="origin"
              placeholder="Lugar de origen"
              value={formData.origin}
              onChange={(e) =>
                setFormData({ ...formData, origin: e.target.value })
              }
              required={true}
            />

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creando...
                  </>
                ) : (
                  "Crear Mineral"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
