import React from "react";
// import { redirect, Route  } from "react-router-dom";
import {Navigate, useLocation} from "react-router-dom"


function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  console.log("this", isAuthenticated);

  let location = useLocation();

    if(!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location}} replace />
    }
 return children
}

export default ProtectedRoute;