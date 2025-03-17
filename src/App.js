import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./View/Login/Login";
import Home from "./View/Home/Index";
import ProtectedRoute from "./components/ProtectedRoutes";
import AppLogout from "./utilities/AppLogout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={
          <AppLogout>
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </AppLogout>
        }/>
        <Route path="/login" element={<Login></Login>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;