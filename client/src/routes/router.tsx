import { AppLayout } from "@/app/layout/AppLayout";
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
        element: <Dashboard />,
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
            element: <EmployeeCreate />,
          },
          {
            path: "edit",
            element: <EmployeeEdit />,
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
            element: <ProjectCreate />,
          },
          {
            path: ":id",
            element: <ProjectDetails />,
          },
          {
            path: ":projectId/edit",
            element: <ProjectCreate />,
          },
        ],
      },
    ],
  },
]);

export default router;
