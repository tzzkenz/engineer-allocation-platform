import { AppLayout } from "@/app/layout/AppLayout";
import { createBrowserRouter } from "react-router";

import EmployeeCreate from "@pages/employee-create/EmployeeCreate";
import EmployeeEdit from "@pages/employee-edit/EmployeeEdit";
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
        path: "profile",
        element: <EmployeeProfile />,
      },
      {
        path: "employee",
        children: [
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
        ],
      },
    ],
  },
]);

export default router;
