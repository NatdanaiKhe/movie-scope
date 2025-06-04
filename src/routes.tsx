import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import Error from "@/components/Error";
import Home from "@/pages/Home";
import Movie from "@/pages/Movie";
import Movies from "@/pages/Movies";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Set MainLayout as the parent element
    errorElement: <Error />,
    children: [
      {
        path: "", // This means the index route (i.e., "/")
        element: <Home />,
      },
      {
        path: "movie/:movieId",
        element: <Movie />,
      },
      {
        path: "movies",
        element: <Movies />, // Assuming you want to show the same Home component for /movies
      },
      
    ],
  },
]);

export default router;
