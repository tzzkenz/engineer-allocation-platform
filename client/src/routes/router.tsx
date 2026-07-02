import { AppLayout } from "@/app/layout/AppLayout";
import PermissionGate from "@/entities/auth/components/permission-gate/PermissionGate";
import { SYSTEM_ROLES } from "@/entities/config/lib/roles";
import { createBrowserRouter } from "react-router";

import { Dashboard } from "@pages/dashboard/Dashboard";
import EmployeeCreate from "@pages/employee-create/EmployeeCreate";
import EmployeeEdit from "@pages/employee-edit/EmployeeEdit";
import { EmployeeList } from "@pages/employee-list/EmployeeList";
import { EmployeeProfile } from "@pages/employee-profile/EmployeeProfile";
import Login from "@pages/login/Login";
import ProjectCreate from "@pages/project-create/ProjectCreate";
import { ProjectDetails } from "@pages/project-details/ProjectDetails";
import { ProjectList } from "@pages/project-list/ProjectList";

import RouteGate from "./route-gate/RouteGate";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <RouteGate requiredRoles={[SYSTEM_ROLES.HR]}>
            <Dashboard />
          </RouteGate>
        ),
      },
      {
        path: "profile",
        element: <EmployeeProfile />,
      },

      {
        path: "employee",
        children: [
          {
            index: true,
            element: <EmployeeList />,
          },
          {
            path: "create",
            element: (
              <RouteGate requiredRoles={[SYSTEM_ROLES.HR]}>
                <EmployeeCreate />{" "}
              </RouteGate>
            ),
          },
          {
            path: ":emp_id/edit",
            element: (
              <RouteGate requiredRoles={[SYSTEM_ROLES.HR]}>
                <EmployeeEdit />{" "}
              </RouteGate>
            ),
          },
          {
            path: ":emp_id",
            element: <EmployeeProfile />,
          },
        ],
      },
      {
        path: "project",
        children: [
          {
            index: true,
            element: <ProjectList />,
          },
          {
            path: "create",
            element: (
              <RouteGate requiredRoles={[SYSTEM_ROLES.HR]}>
                <ProjectCreate />{" "}
              </RouteGate>
            ),
          },
          {
            path: ":id",
            element: <ProjectDetails />,
          },
          {
            path: ":projectId/edit",
            element: (
              <RouteGate requiredRoles={[SYSTEM_ROLES.HR]}>
                <ProjectCreate />
              </RouteGate>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
