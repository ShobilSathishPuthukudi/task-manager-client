import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes.jsx";
import TaskRoutes from "./routes/TaskRoutes.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./features/auth/authSlice.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<TaskRoutes />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
