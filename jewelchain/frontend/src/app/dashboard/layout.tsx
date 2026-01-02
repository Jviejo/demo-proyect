"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaStore,
  FaExchangeAlt,
  FaBoxes,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaShippingFast,
} from "react-icons/fa";
import { usePermissions } from "@/hooks/usePermissions";
import { UserRole } from "@/types/user";

// Definimos las rutas y sus permisos requeridos
type RoutePermissions = {
  [key: string]: UserRole[];
};

const ROUTE_PERMISSIONS: RoutePermissions = {
  "/dashboard/shipment": ["DISTRIBUTOR_ROLE"],
  "/dashboard/users": ["ADMIN_ROLE"],
  "/dashboard/raw-material": ["RAW_MINERAL_ROLE"],
  "/dashboard/store": ["JEWEL_FACTORY_ROLE", "STORE_ROLE"],
  "/dashboard/purchase-orders": [
    "ADMIN_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE",
  ],
  "/dashboard/sales-orders": [
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE",
  ],
  "/dashboard/transactions": [
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE",
  ],
  "/dashboard/locations": [
    "ADMIN_ROLE",
    "RAW_MINERAL_ROLE",
    "JEWEL_FACTORY_ROLE",
    "DISTRIBUTOR_ROLE",
    "STORE_ROLE",
  ],
  "/dashboard/factory-materials-inventory": [
    "JEWEL_FACTORY_ROLE",
  ],
  "/dashboard/jewel-inventory": [
    "JEWEL_FACTORY_ROLE",
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, disconnect, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading: isLoadingPermissions } = usePermissions();

  useEffect(() => {
    if (!isConnected || !user) {
      router.push("/");
      return;
    }

    if (pathname !== "/dashboard" && pathname !== "/dashboard/my-account") {
      const currentPath = Object.keys(ROUTE_PERMISSIONS).find((route) =>
        pathname.startsWith(route)
      );

      if (currentPath) {
        const requiredRoles = ROUTE_PERMISSIONS[currentPath];
        const hasPermission =
          requiredRoles.includes(user.role) || user.role === "ADMIN_ROLE";

        if (!hasPermission) {
          router.push("/unauthorized");
        }
      }
    }
  }, [isConnected, router, user, pathname]);

  // Si no está conectado o no hay usuario, no renderizamos nada
  if (!isConnected || !user) {
    return null;
  }

  // Mostramos loading mientras se cargan los permisos
  if (isLoadingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Función para verificar si el usuario tiene acceso a una ruta específica
  const hasRouteAccess = (route: string): boolean => {
    const requiredRoles = ROUTE_PERMISSIONS[route];
    if (!requiredRoles) return true; // Si no hay roles definidos, permitir acceso
    return requiredRoles.includes(user.role) || user.role === "ADMIN_ROLE";
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="p-4">{children}</div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="mb-4">
            <div className="font-bold">JewelChain Traceability Panel</div>
          </li>

          <li>
            <Link href="/dashboard">
              <FaHome className="w-4 h-4" /> Dashboard
            </Link>
          </li>

          {hasRouteAccess("/dashboard/store") && (
            <li>
              <Link href="/dashboard/store">
                <FaShoppingBag className="w-4 h-4" />
                Tienda
              </Link>
            </li>
          )}

          {hasRouteAccess("/dashboard/purchase-orders") && (
            <li>
              <Link href="/dashboard/purchase-orders">
                <FaShoppingCart className="w-4 h-4" /> Ordenes de compra
              </Link>
            </li>
          )}

          {hasRouteAccess("/dashboard/shipment") && (
            <li>
              <Link href="/dashboard/shipment">
                <FaShippingFast className="w-4 h-4" /> Envíos
              </Link>
            </li>
          )}

          {hasRouteAccess("/dashboard/sales-orders") && (
            <li>
              <Link href="/dashboard/sales-orders">
                <FaStore className="w-4 h-4" /> Ordenes de venta
              </Link>
            </li>
          )}

          {hasRouteAccess("/dashboard/transactions") && (
            <li>
              <Link href="/dashboard/transactions">
                <FaExchangeAlt className="w-4 h-4" /> Transacciones
              </Link>
            </li>
          )}

          {hasRouteAccess("/dashboard/raw-material") && (
            <li>
              <Link href="/dashboard/raw-material">
                <FaBoxes className="w-4 h-4" /> Inventario
              </Link>
            </li>
          )}


          {hasRouteAccess("/dashboard/factory-materials-inventory") && (
            <li>
              <Link href="/dashboard/factory-materials-inventory">
                <FaBoxes className="w-4 h-4" /> Inventario materiales
              </Link>
            </li>
          )}

          {hasRouteAccess("/dashboard/jewel-inventory") && (
            <li>
              <Link href="/dashboard/jewel-inventory">
                <FaBoxes className="w-4 h-4" /> Inventario joyas
              </Link>
            </li>
          )}

          {hasRouteAccess("/dashboard/locations") && (
            <li>
              <Link href="/dashboard/locations">
                <FaMapMarkerAlt className="w-4 h-4" /> Ubicaciones
              </Link>
            </li>
          )}

          {hasRouteAccess("/dashboard/users") && (
            <li>
              <Link href="/dashboard/users">
                <FaUsers className="w-4 h-4" /> Usuarios
              </Link>
            </li>
          )}

          <li>
            <Link href="/dashboard/my-account">
              <FaUserCircle className="w-4 h-4" /> Mi cuenta
              <p className="text-xs text-gray-500">
                Wallet: {user?.address?.slice(0, 6)}...
                {user?.address?.slice(-4)}
              </p>
            </Link>
          </li>

          <div className="mt-auto">
            <li>
              <button onClick={disconnect} className="btn btn-outline w-full">
                <FaSignOutAlt className="w-4 h-4" /> Cerrar Sesión
              </button>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}
