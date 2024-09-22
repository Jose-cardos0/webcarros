import { createBrowserRouter } from "react-router-dom";

//pages
import { Home } from "./Pages/Home/Home";
import { Login } from "./Pages/Login/Login";
import { Register } from "./Pages/Register/Register";
import { CarDetail } from "./Pages/Car/CarDetail";
import { DashBoard } from "./Pages/DashBoard/DashBoard";
import { RegCar } from "./Pages/DashBoard/NewCar/NewCar";
import { Layout } from "./Components/Layout/Layout";

//protect
import { Private } from "./Routes/Private";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/car/:id",
        element: <CarDetail />,
      },
      {
        path: "/dashboard",
        element: (
          <Private>
            <DashBoard />
          </Private>
        ),
      },
      {
        path: "/dashboard/newcar",
        element: (
          <Private>
            <RegCar />
          </Private>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export { router };
