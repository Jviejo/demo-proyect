"use client";

import { RawMineralChain } from "@/domain/raw-mineral/RawMineral";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { FaEye, FaEdit } from "react-icons/fa";
import { BadgeQuality } from "../badge/BadgeQuality";

interface RawMineralTableProps {
  rawMineralList: RawMineralChain[];
}

export const RawMineralTable = ({ rawMineralList }: RawMineralTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Cantidad</th>
            <th>Calidad</th>
            <th>Origen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rawMineralList.map((mineral) => (
            <tr key={mineral.uniqueId}>
              <td>{mineral.uniqueId}</td>
              <td>{mineral.name}</td>
              <td>{formatDate(new Date(Number(mineral.date)))}</td>
              <td>{mineral.quantity}</td>
              <td>
                <BadgeQuality quality={mineral.quality} />
              </td>
              <td>{mineral.origin}</td>
              <td className="space-x-2">
                <Link
                  href={`/dashboard/raw-material/${mineral.uniqueId}`}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/raw-material/${mineral.uniqueId}/edit`}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEdit className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
