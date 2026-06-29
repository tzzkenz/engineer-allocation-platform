import { AppLayout } from "@/app/layout/AppLayout";
import { EmployeeProfile } from "@/pages/employee-profile/EmployeeProfile";
import { createBrowserRouter } from "react-router";
import EmployeeCreate from "@/pages/employee-create/EmployeeCreate";

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
        path:"employee-create",
        element:<EmployeeCreate/>,
      }
    ],
  },
]);

export default router;
