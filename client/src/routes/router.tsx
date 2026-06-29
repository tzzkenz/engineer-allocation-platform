import { AppLayout } from "@/app/layout/AppLayout";
import { EmployeeProfile } from "@/pages/employee-profile/EmployeeProfile";
import { ProjectList } from "@/pages/project-list/ProjectList";
import { createBrowserRouter } from "react-router";
import EmployeeCreate from "@/pages/employee-create/EmployeeCreate";
import EmployeeEdit from "@/pages/employee-edit/EmployeeEdit";

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
        path:"employee",
        children:[
          {
            path:"create",
            element:<EmployeeCreate/>,
          },
          {
            path:"edit",
            element:<EmployeeEdit/>,
          },
        ]
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
