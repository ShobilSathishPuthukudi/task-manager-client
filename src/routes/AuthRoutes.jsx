import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";

const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />}></Route>
    <Route path="/register" element={<Register />}></Route>
    <Route path="/dashboard" element={<Dashboard />}></Route>
    <Route path="*" element={<div>404 Not Found</div>}></Route>
  </Routes>
);

export default AuthRoutes;
