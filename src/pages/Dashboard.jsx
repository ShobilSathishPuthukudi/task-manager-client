import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { clearTaskError, getTasks } from "../features/task/taskSlice";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, isLoading, message, errors } = useSelector(
    (state) => state.tasks,
  );

  useEffect(() => {
    dispatch(getTasks());
  }, []);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearTaskError());
      }, 3000);
    }
  }, [message]);

  const onLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  const onNewTask = () => {
    navigate("/tasks/create");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-gray-900 transition-all duration-300 flex flex-col`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-4">
          <div className="h-8 w-8 bg-red-500 rounded-lg"></div>
          {isSidebarOpen && (
            <span className="text-white text-xl font-bold">Taskify</span>
          )}
        </div>

        {/* Desktop Navigation Items */}
        <nav className="flex-grow px-4 mt-4 space-y-2">
          <NavItem icon="🏠" label="Dashboard" active isOpen={isSidebarOpen} />
          <NavItem icon="📝" label="My Tasks" isOpen={isSidebarOpen} />
          <NavItem icon="🗑️" label="Trash" isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="flex items-center gap-4 w-full p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-gray-500"
            >
              ☰
            </button>

            <h1 className="text-lg font-semibold">
              Welcome, {user?.name || "User"}!
            </h1>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <section className="p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* TITLE + BUTTON */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Tasks</h2>

              <button
                onClick={onNewTask}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl"
              >
                + New Task
              </button>
            </div>

            {/* ERROR */}
            {message && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                {message}
              </div>
            )}

            {/* LOADING */}
            {isLoading && (
              <p className="text-center text-gray-500">Loading tasks...</p>
            )}

            {/* EMPTY STATE */}
            {!isLoading && tasks.length === 0 && (
              <p className="text-center text-gray-400">No tasks found.</p>
            )}

            {/* TASK GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="p-6 bg-white rounded-2xl border shadow-sm hover:shadow-md transition"
                >
                  <div className="h-2 w-12 bg-red-400 rounded mb-3"></div>

                  <h3 className="font-bold text-lg">{task.title}</h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {task.description}
                  </p>

                  <div className="flex justify-end gap-3 mt-4">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>

                    <button
                      onClick={() => dispatch(deleteTask(task._id))}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// ================= NAV ITEM =================

const NavItem = ({ icon, label, active = false, isOpen }) => (
  <div
    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer ${
      active
        ? "bg-red-500 text-white"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`}
  >
    <span className="text-xl">{icon}</span>
    {isOpen && <span>{label}</span>}
  </div>
);

export default Dashboard;
