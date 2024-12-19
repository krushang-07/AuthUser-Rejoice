import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./components/protectedRoutes";
import { useRoutes } from "react-router-dom";


//Dynamic Routing using useRoutes();
const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
  ]);
  return routes;
};

function App() {
  return (
    //---------------> Normal Routing
    
    // <Routes>
    //   <Route path="/signup" element={<Signup />} />
    //   <Route path="/login" element={<Login />} />
    //   <Route
    //     path="/"
    //     element={
    //       <ProtectedRoute>
    //         <Home />
    //       </ProtectedRoute>
    //     }
    //   />
    //   <Route path="/" element={<Login />} />
    // </Routes>
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;
