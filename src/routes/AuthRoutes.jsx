import { Routes, Route, Navigate } from "react-router-dom";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="login" />} />
    </Routes>
  );
};

export default AuthRoutes;
