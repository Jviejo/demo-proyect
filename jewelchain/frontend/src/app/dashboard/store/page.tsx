"use client";

import { BadgeQuality } from "@/components/badge/BadgeQuality";
import { CardStore } from "@/components/card/CardStore";
import { TruncateItem } from "@/components/truncate/TruncateItem";
import { UserSelect } from "@/components/UserSelect/UserSelect";
import { useAuth } from "@/context/AuthContext";
import { RawMineralChain } from "@/domain/raw-mineral/RawMineral";
import { useRawMineralService } from "@/hooks/raw-mineral/useRawMineral";
import { User } from "@/types/user";
import { Fragment, ReactNode, useState } from "react";

export default function Store() {
  const { provider, user } = useAuth();
  const { rawMineralList, isLoading, getAllRawMineral } =
    useRawMineralService(provider);
  const [userSelected, setUserSelected] = useState<string>("");

  const onChangeSelect = async (user: User) => {
    if (user.role === "RAW_MINERAL_ROLE") {
      await getAllRawMineral(user.address);
      setUserSelected(user.address);
    }
  };

  const buyStore = async () => {
    if (user) {
      await getAllRawMineral(userSelected);
    }
  };

  const descriptionRawMinerla = (rawMineral: RawMineralChain): ReactNode => {
    return (
      <Fragment>
        <div className="flex flex-row items-center justify-between">
          <TruncateItem item={rawMineral.uniqueId} />
          <span>Cantidad: {rawMineral.quantity}</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span>
            Calidad: <BadgeQuality quality={rawMineral.quality} />
          </span>
          <span>Origen: {rawMineral.origin}</span>
        </div>
      </Fragment>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tienda</h1>
      </div>

      <div>
        <UserSelect handlerSelect={onChangeSelect} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {rawMineralList.length > 0 &&
          rawMineralList.map((rawMineral) => (
            <div key={rawMineral.uniqueId}>
              <CardStore
                uniqueId={rawMineral.uniqueId}
                addressSuplier={userSelected}
                description={descriptionRawMinerla(rawMineral)}
                image={rawMineral.img}
                name={rawMineral.name}
                availableQuantity={Number(rawMineral.quantity)}
                onSelect={buyStore}
              />
            </div>
          ))}
      </div>
      <div>{isLoading && <p className="text-center">Cargando...</p>}</div>
    </div>
  );
}
