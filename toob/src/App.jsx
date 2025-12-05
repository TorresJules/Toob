import { BrowserRouter as Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/HomePage";
import Root from "./routes/Root";
import ErrorPage from "./routes/ErrorPage";
import MovieDetail from "./routes/MovieDetail";
import RegisterPage from "./routes/RegisterPage";
import LoginPage from "./routes/LoginPage";
import SearchPage from "./routes/SearchPage";
import FavoritesPage from "./routes/FavoritesPage";
import ProfilePage from "./routes/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "movies/:id",
        element: <HomePage />, // HomePage reste visible, MovieDetail est un overlay géré par Root
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;