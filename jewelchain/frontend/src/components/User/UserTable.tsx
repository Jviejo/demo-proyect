"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import Link from "next/link";
import { FaEye, FaEdit } from "react-icons/fa";
import {
  getRoleBadgeColor,
  getRoleIcon,
  getRoleLabel,
} from "@/utils/roleUtils";
import { ethers } from "ethers";
import { USER_ABI } from "@/lib/abi/user";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserDeleteButton } from "./UserDeleteButton";

const mapRole = (roleHash: string): string => {
  const roles = {
    [ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"))]: "ADMIN_ROLE",
    [ethers.keccak256(ethers.toUtf8Bytes("RAW_MINERAL_ROLE"))]:
      "RAW_MINERAL_ROLE",
    [ethers.keccak256(ethers.toUtf8Bytes("JEWEL_FACTORY_ROLE"))]:
      "JEWEL_FACTORY_ROLE",
    [ethers.keccak256(ethers.toUtf8Bytes("DISTRIBUTOR_ROLE"))]:
      "DISTRIBUTOR_ROLE",
    [ethers.keccak256(ethers.toUtf8Bytes("STORE_ROLE"))]: "STORE_ROLE",
  };
  return roles[roleHash] || "UNKNOWN_ROLE";
};

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { provider } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!provider) {
          throw new Error("No hay conexión con el proveedor");
        }

        const signer = await provider.getSigner();
        const ADDRESS = process.env.NEXT_PUBLIC_USER_CONTRACT_ADDRESS;

        if (!ADDRESS) {
          throw new Error("La dirección del contrato no está definida");
        }

        const contract = new ethers.Contract(ADDRESS, USER_ABI, signer);
        const userList = await contract.getListUsers();

        const mappedUsers: User[] = userList.map((user: User) => ({
          address: user.user,
          role: mapRole(user.role),
          isActive: user.isActive,
          name: user.name,
        }));

        setUsers(mappedUsers);
        setIsLoading(false);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setIsLoading(false);
      }
    };

    if (provider) {
      fetchUsers();
    }
  }, [provider]);

  const handleDelete = (address: string) => {
    const usersD = users.filter((user) => user.address !== address);
    setUsers(usersD);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>Error al cargar los usuarios: {error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Dirección</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.address}>
              <td>
                <code className="text-sm bg-base-200 p-1 rounded">
                  {user.address}
                </code>
              </td>
              <td>{user.name}</td>
              <td>
                <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                  {React.createElement(getRoleIcon(user.role), {
                    className: "w-4 h-4 mr-1",
                  })}
                  {getRoleLabel(user.role)}
                </span>
              </td>
              <td>
                <span
                  className={`badge ${
                    user.isActive ? "badge-success" : "badge-error"
                  }`}
                >
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="space-x-2">
                <Link
                  href={`/dashboard/users/${user.address}`}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/users/${user.address}/edit`}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEdit className="w-4 h-4" />
                </Link>
                <UserDeleteButton
                  address={user.address}
                  onDeleteUser={handleDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
