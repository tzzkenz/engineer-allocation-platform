import { AppLayout } from "@/app/layout/AppLayout";
import { EmployeeProfile } from "@/pages/employee-profile/EmployeeProfile";
import { ProjectList } from "@/pages/project-list/ProjectList";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "employee-profile",
        element: <EmployeeProfile />,
      },
      {
        path: "projects",
        children: [
          {
            index: true,
            element: <ProjectList />,
          },
        ],
      },
    ],
  },
]);

export default router;
