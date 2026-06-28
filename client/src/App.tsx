import { RouterProvider } from "react-router";

import router from "@routes/router";

import "./App.css";

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
