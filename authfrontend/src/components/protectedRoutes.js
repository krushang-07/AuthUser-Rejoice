import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); //from auth slice

    return isLoggedIn ? children : <Navigate to="/login" />;
    //this children has a protected routes children like <protectedRoutes><Home><protectedRoutes> that home are children of protected routes.
};

export default ProtectedRoute;
