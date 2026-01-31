import { BrowserRouter } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./features/auth/authThunk.js";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
  );
};

export default App;
