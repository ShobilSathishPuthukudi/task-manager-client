import { BrowserRouter } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes.jsx";

const App = () => (
  <BrowserRouter>
    <AuthRoutes />
  </BrowserRouter>
);

export default App;
