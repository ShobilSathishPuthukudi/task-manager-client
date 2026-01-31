import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- Sidebar --- */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-gray-900 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center gap-4">
          <div className="h-8 w-8 bg-red-500 rounded-lg flex-shrink-0"></div>
          {isSidebarOpen && (
            <span className="text-white text-xl font-bold tracking-tight">
              Taskify
            </span>
          )}
        </div>

        <nav className="flex-grow px-4 mt-4 space-y-2">
          <NavItem icon="🏠" label="Dashboard" active isOpen={isSidebarOpen} />
          <NavItem icon="📝" label="My Tasks" isOpen={isSidebarOpen} />
          <NavItem icon="⭐" label="Important" isOpen={isSidebarOpen} />
          <NavItem icon="✅" label="Completed" isOpen={isSidebarOpen} />
        </nav>

        {/* User Profile / Logout Section */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="flex items-center gap-4 w-full p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              Welcome, {user?.name || "User"}!
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search tasks..."
              className="hidden md:block bg-gray-100 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 w-64"
            />
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200">
              <span className="text-red-600 font-bold">U</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Today's Overview
              </h2>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors shadow-lg shadow-red-200">
                + New Task
              </button>
            </div>

            {/* Placeholder for Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-2 w-12 bg-red-400 rounded mb-4"></div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Complete UI Design
                </h3>
                <p className="text-gray-500 text-sm">
                  Design the dashboard for the task management app...
                </p>
              </div>
              {/* Add more cards here */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Simple NavItem Component for cleaner code
const NavItem = ({ icon, label, active = false, isOpen }) => (
  <div
    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-red-500 text-white"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`}
  >
    <span className="text-xl">{icon}</span>
    {isOpen && <span className="font-medium">{label}</span>}
  </div>
);

export default Dashboard;
