import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

//router
import { RouterProvider } from "react-router-dom";
import { router } from "./App.tsx";

//protect
import AuthProvider from "./Context/ProtectContext.tsx";

//slider swiper
import { register } from "swiper/element-bundle";

register();
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
