import { type ReactNode } from "react";

import { useAppSelector } from "@/store/store";
import { Navigate } from "react-router";

type PermissionGateProps = {
  requiredRoles: string[];
  children: ReactNode;
};

const RouteGate = ({ requiredRoles, children }: PermissionGateProps) => {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const hasPermission = requiredRoles.some((role) => authUser!.system_role_name === role);

  if (!hasPermission) {
    return <Navigate to="/project" />;
  }

  return <>{children}</>;
};

export default RouteGate;
