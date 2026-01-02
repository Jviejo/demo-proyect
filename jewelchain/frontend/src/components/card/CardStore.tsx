import React, { ReactNode, useState } from "react";
import Image from "next/image";
import { useRawMineralOrders } from "@/hooks/raw-mineral/useRawMineralOrders";
import { useAuth } from "@/context/AuthContext";

interface CardStoreProps {
  name: string;
  image: string;
  description: ReactNode;
  addressSuplier: string;
  uniqueId: string;
  availableQuantity: number;
  onSelect: () => void;
}

export const CardStore = ({
  name,
  image,
  description,
  addressSuplier,
  uniqueId,
  availableQuantity,
  onSelect,
}: CardStoreProps) => {
  const { provider } = useAuth();
  const { isLoading, orderMineral } = useRawMineralOrders(provider);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setError(null);
    
    if (value <= 0) {
      setError("La cantidad debe ser mayor que 0");
      setQuantity(1);
      return;
    }
    
    if (value > availableQuantity) {
      setError(`Solo hay ${availableQuantity} unidades disponibles`);
      setQuantity(availableQuantity);
      return;
    }
    
    setQuantity(value);
  };

  const handelerClick = async () => {
    if (quantity <= 0 || quantity > availableQuantity) {
      setError("Cantidad no válida");
      return;
    }

    try {
      await orderMineral(addressSuplier, uniqueId, quantity);
      onSelect();
    } catch (error) {
      console.error("Error al realizar el pedido", error);
      setError("Error al realizar el pedido");
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure>
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="w-full h-48 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <div>{description}</div>
        {error && (
          <div className="text-error text-sm">{error}</div>
        )}
        <div className="card-actions justify-end items-center gap-2">
          <div className="form-control w-16">
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={availableQuantity}
              disabled={isLoading}
            />
          </div>
          <div className="text-sm text-gray-500">
            de {availableQuantity} disponibles
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handelerClick}
            disabled={isLoading || quantity <= 0 || quantity > availableQuantity}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Solicitar...
              </>
            ) : (
              "Solicitar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
