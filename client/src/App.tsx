import { RouterProvider } from "react-router";

import router from "@routes/router";

import "./App.css";
import { TooltipProvider } from "./shared/components/ui/tooltip";

function App() {
  return (
    <div>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </div>
  );
}

export default App;
