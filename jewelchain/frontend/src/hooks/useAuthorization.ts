import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { UserRole } from "@/types/user";

export function useAuthorization(authorizedRoles: UserRole[]) {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (user) {
      const hasPermission = authorizedRoles.includes(user.role);
      setIsAuthorized(hasPermission);
    }
  }, [user, authorizedRoles]);

  return isAuthorized;
} 