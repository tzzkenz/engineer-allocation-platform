import { type ReactNode } from "react";

import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@features/auth/hooks/useAuth";

type PrivateRouteProps = {
  children?: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
