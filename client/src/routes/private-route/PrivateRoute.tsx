import { type ReactNode } from "react";

import { useAppSelector } from "@/store/store";
import { Navigate, Outlet, useLocation } from "react-router";

type PrivateRouteProps = {
  children?: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
