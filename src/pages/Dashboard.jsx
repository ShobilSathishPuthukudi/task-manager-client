import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import {
  clearTaskError,
  getTasks,
  getTrashTasks,
  deleteTask,
  restoreTask,
  permanentlyDeleteTask,
} from "../features/task/taskSlice";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [view, setView] = useState("board");
  const columns = [
    { label: "To-Do", status: "pending", color: "bg-blue-500" },
    { label: "In Progress", status: "in-progress", color: "bg-yellow-500" },
    { label: "Completed", status: "completed", color: "bg-green-500" },
  ];

  const {
    tasks = [],
    trashTasks = [],
    isLoading,
    message,
  } = useSelector((state) => state.tasks);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (view === "board") {
      dispatch(getTasks());
    } else {
      dispatch(getTrashTasks());
    }
  }, [view, dispatch]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearTaskError());
      }, 3000);
    }
  }, [message]);

  const hasTasks = tasks && tasks.length > 0;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans">
      {/* SIDEBAR */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-gray-900 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center gap-4">
          <div className="h-8 w-8 bg-red-500 rounded-lg"></div>
          {isSidebarOpen && (
            <span className="text-white text-xl font-bold">Taskify</span>
          )}
        </div>
        <nav className="flex-grow px-4 mt-4 space-y-2">
          <div onClick={() => setView("board")}>
            <NavItem
              icon="🏠"
              label="Dashboard"
              active={view === "board"}
              isOpen={isSidebarOpen}
            />
          </div>
          <div onClick={() => setView("trash")}>
            <NavItem
              icon="🗑️"
              label="Trash"
              active={view === "trash"}
              isOpen={isSidebarOpen}
            />
          </div>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/auth/login");
            }}
            className="flex items-center gap-4 w-full p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 text-xl"
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold text-gray-700">
              Welcome, {user?.name || "User"}!
            </h1>
          </div>
        </header>

        <section className="p-8 overflow-x-auto h-full">
          <div className="flex justify-between items-center mb-8 shrink-0">
            <h2 className="text-2xl font-bold text-gray-800">
              {view === "board" ? "Project Board" : "Trash Bin"}
            </h2>
            {view === "board" && tasks && tasks.length !== 0 && (
              <button
                onClick={() => navigate("/tasks/create")}
                className="bg-red-500 text-white px-6 py-2 rounded-xl shadow-lg"
              >
                + Add Task
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="animate-pulse">Loading...</p>
            </div>
          ) : view === "board" ? (
            tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-700">
                  Your board is empty
                </h3>
                <p className="text-gray-400 mb-6 text-center">
                  Create your first task to get started
                </p>
                <button
                  onClick={() => navigate("/tasks/create")}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105"
                >
                  + Create Task
                </button>
              </div>
            ) : (
              /* KANBAN BOARD */
              <div className="flex gap-6 h-[calc(100vh-200px)] min-w-max">
                {columns.map((col) => (
                  <div
                    key={col.status}
                    className="w-80 flex flex-col bg-gray-100/50 rounded-2xl p-4"
                  >
                    <div className="flex justify-between mb-4 px-2 font-bold text-gray-600 uppercase text-xs">
                      <span>{col.label}</span>
                      <span className="bg-gray-200 px-2 py-0.5 rounded-full">
                        {tasks.filter((t) => t.status === col.status).length}
                      </span>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-2">
                      {tasks
                        .filter((t) => t.status === col.status)
                        .map((task) => (
                          <div
                            key={task._id}
                            className="bg-white p-5 rounded-2xl border group relative shadow-sm hover:shadow-md transition-all cursor-pointer"
                          >
                            <h3 className="font-bold text-gray-800">
                              {task.title}
                            </h3>

                            {/* QUICK DELETE */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(deleteTask(task._id));
                              }}
                              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* TRASH VIEW */
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              {trashTasks.length === 0 ? (
                <p className="text-center text-gray-400 py-10">
                  Trash is empty
                </p>
              ) : (
                <table className="w-full text-left">
                  <thead className="text-gray-400 text-xs uppercase border-b">
                    <tr>
                      <th className="pb-4">Task Name</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {trashTasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="py-4 font-medium">{task.title}</td>
                        <td className="py-4 text-right space-x-4">
                          <button
                            onClick={() => dispatch(restoreTask(task._id))}
                            className="text-blue-500 font-bold text-sm"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Delete permanently?"))
                                dispatch(permanentlyDeleteTask(task._id));
                            }}
                            className="text-red-500 font-bold text-sm"
                          >
                            Delete Forever
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// NavItem
const NavItem = ({ icon, label, active = false, isOpen }) => (
  <div
    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer 
      ${active ? "bg-red-500 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
  >
    <span className="text-xl">{icon}</span>
    {isOpen && <span>{label}</span>}
  </div>
);

export default Dashboard;
