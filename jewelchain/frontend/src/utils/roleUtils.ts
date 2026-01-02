import { UserRole } from "@/types/user";
import { 
  FaUserShield, // Admin
  FaGem, // Minero
  FaIndustry, // Fabricante
  FaTruck, // Distribuidor
  FaStore, // Tienda
  FaQuestion // Desconocido
} from "react-icons/fa";
import { IconType } from "react-icons";

export const getRoleBadgeColor = (role: UserRole): string => {
  const colors = {
    ADMIN_ROLE: "badge-primary",
    RAW_MINERAL_ROLE: "badge-secondary",
    JEWEL_FACTORY_ROLE: "badge-accent",
    DISTRIBUTOR_ROLE: "badge-info",
    STORE_ROLE: "badge-success",
    UNKNOWN_ROLE: "badge-ghost"
  };
  return colors[role] || colors.UNKNOWN_ROLE;
};

export const getRoleLabel = (role: UserRole): string => {
  const labels = {
    ADMIN_ROLE: "Administrador",
    RAW_MINERAL_ROLE: "Minero",
    JEWEL_FACTORY_ROLE: "Fabricante",
    DISTRIBUTOR_ROLE: "Distribuidor",
    STORE_ROLE: "Tienda",
    UNKNOWN_ROLE: "Desconocido"
  };
  return labels[role] || labels.UNKNOWN_ROLE;
};

export const getRoleIcon = (role: UserRole): IconType => {
  const icons = {
    ADMIN_ROLE: FaUserShield,
    RAW_MINERAL_ROLE: FaGem,
    JEWEL_FACTORY_ROLE: FaIndustry,
    DISTRIBUTOR_ROLE: FaTruck,
    STORE_ROLE: FaStore,
    UNKNOWN_ROLE: FaQuestion
  };
  return icons[role] || icons.UNKNOWN_ROLE;
}; 