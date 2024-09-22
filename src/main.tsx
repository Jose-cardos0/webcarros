import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

//router
import { RouterProvider } from "react-router-dom";
import { router } from "./App.tsx";

//protect
import AuthProvider from "./Context/ProtectContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
