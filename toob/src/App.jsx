import { BrowserRouter as Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/HomePage";
import Root from "./routes/Root";
import ErrorPage from "./routes/ErrorPage";
import MovieDetail from "./routes/MovieDetail";

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
    element: <div>Register</div>,
  },
]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;