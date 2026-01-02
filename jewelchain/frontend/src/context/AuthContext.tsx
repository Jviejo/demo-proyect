"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";
import { User, UserRole } from "@/types/user";
import { ABI_USER } from "@/abis/user";

interface Roles {
  [key: string]: string;
}

const roles: Roles = {
  ADMIN_ROLE: ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE")),
  RAW_MINERAL_ROLE: ethers.keccak256(ethers.toUtf8Bytes("RAW_MINERAL_ROLE")),
  JEWEL_FACTORY_ROLE: ethers.keccak256(
    ethers.toUtf8Bytes("JEWEL_FACTORY_ROLE")
  ),
  DISTRIBUTOR_ROLE: ethers.keccak256(ethers.toUtf8Bytes("DISTRIBUTOR_ROLE")),
  STORE_ROLE: ethers.keccak256(ethers.toUtf8Bytes("STORE_ROLE")),
};

interface AuthContextType {
  user: User | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  provider: BrowserProvider | null;
}
const ADDRESS = process.env.NEXT_PUBLIC_USER_CONTRACT_ADDRESS as string;
if (!ADDRESS) throw new Error("La dirección del userContract no está definida");

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const connect = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(ADDRESS, ABI_USER, signer);
        await contract
          .loginUser()
          .then((user) => {
            if (!user[2]) {
              // Check if user is not active
              alert(
                "Tu cuenta está desactivada. Por favor, contacta al administrador."
              );
              return null;
            }
            setUser({
              address: user[0],
              role: getRoleName(user[1]),
              isActive: user[2],
              name: user[3],
            });
          })
          .catch((error) => {
            console.error("Error al obtener el usuario:", error);
            alert("Tu cuenta no está registrada en la plataforma.");
            return null;
          });
      } else {
        alert("Por favor, instala MetaMask");
      }
    } catch (error) {
      console.error("Error al conectar:", error);
    }
  };

  const disconnect = () => {
    setUser(null);
    localStorage.removeItem("walletConnected");
  };

  const handleAccountsChanged = () => {
    disconnect();
    connect();
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (localStorage.getItem("walletConnected") === "true") {
        await connect();
      }
    };
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, connect, disconnect, isConnected: !!user, provider }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

function getRoleName(roleHash: string): UserRole {
  for (const [roleName, hash] of Object.entries(roles)) {
    if (hash === roleHash) {
      return roleName as UserRole;
    }
  }
  return "UNKNOWN_ROLE"; // Devuelve un valor por defecto si no coincide ningún rol
}
