import { Provider } from "react-redux";
import { RouterProvider } from "react-router";

import router from "@routes/router";

import "./App.css";
import { TooltipProvider } from "./shared/components/ui/tooltip";
import store from "./store/store";

function App() {
  return (
    <div>
      <Provider store={store}>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </Provider>
    </div>
  );
}

export default App;
