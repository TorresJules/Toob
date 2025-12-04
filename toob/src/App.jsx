import { BrowserRouter as Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/HomePage";
import Root from "./routes/Root";
import ErrorPage from "./routes/ErrorPage";
import MovieDetail from "./routes/MovieDetail";
import RegisterPage from "./routes/RegisterPage";
import LoginPage from "./routes/LoginPage";
import SearchPage from "./routes/SearchPage";

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
        element: <MovieDetail />,
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
  {
    path: "/search",
    element: <SearchPage />,
  },
]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;