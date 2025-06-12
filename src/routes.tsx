import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import Error from "@/components/Error";
import Home from "@/pages/Home";
import Movie from "@/pages/Movie";
import Movies from "@/pages/Movies";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "movie/:movieId",
        element: <Movie />,
      },
      {
        path: "movies",
        element: <Movies />,
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;
