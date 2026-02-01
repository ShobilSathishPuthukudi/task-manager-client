import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import CreateTask from "../pages/CreateTask.jsx";
import TaskList from "../pages/TaskList.jsx";
import EditTask from "../pages/EditTask.jsx";
import Trash from "../pages/Trash.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const TaskRoutes = () => (
  <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="tasks/" element={<TaskList />}></Route>
      <Route path="tasks/create" element={<CreateTask />}></Route>
      <Route path="tasks/:id/edit" element={<EditTask />}></Route>
      <Route path="tasks/trash" element={<Trash />}></Route>
    </Route>
  </Routes>
);

export default TaskRoutes;
