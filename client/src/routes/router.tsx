import { AppLayout } from "@/app/layout/AppLayout";
import EmployeeCreate from "@/pages/employee-create/EmployeeCreate";
import EmployeeEdit from "@/pages/employee-edit/EmployeeEdit";
import { EmployeeProfile } from "@/pages/employee-profile/EmployeeProfile";
import { ProjectDetails } from "@/pages/project-details/ProjectDetails";
import { ProjectList } from "@/pages/project-list/ProjectList";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
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
            path: ":id",
            element: <ProjectDetails />,
          },
        ],
      },
    ],
  },
]);

export default router;
