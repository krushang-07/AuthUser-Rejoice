import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
//import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/protectedRoutes";
import { useRoutes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

//Dynamic Routing using useRoutes();
const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    // { path: "/forgot-password", element: <ForgotPassword /> },
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

//const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
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
    <GoogleOAuthProvider clientId="27249279823-kp21grlbck751a0t9c8jnpsi762rmf6g.apps.googleusercontent.com">
      <div className="App">
        <AppRoutes />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
