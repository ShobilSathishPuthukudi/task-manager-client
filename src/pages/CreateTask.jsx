import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../features/task/taskSlice";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, message, errors } = useSelector((state) => state.tasks);
  const initialFormData = {
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    tags: "",
    isRecurring: false,
    pattern: "daily",
    interval: 1,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
        isRecurring: formData.isRecurring,
        recurrring: formData.isRecurring
          ? { pattern: formData.pattern, interval: formData.interval }
          : undefined,
      };

      await dispatch(createTask(payload)).unwrap();
      setFormData(initialFormData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Task Creation Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-white text-xl font-bold">Create Task</h2>

        {message && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg text-sm">
            {message}
            {errors && errors.length > 0 && (
              <ul className="mt-2 list-disc list-inside">
                {errors.map((err, index) => (
                  <li key={index}>{err.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={formData.description}
          onChange={handleChange}
        />

        {/* PRIORITY */}
        <select
          name="priority"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* STATUS */}
        <select
          name="status"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* DUE DATE */}
        <input
          type="date"
          name="dueDate"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={formData.dueDate}
          onChange={handleChange}
        />

        {/* TAGS */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={formData.tags}
          onChange={handleChange}
        />

        {/* RECURRING */}
        <div className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
          />
          Recurring Task
        </div>

        {formData.isRecurring && (
          <div className="grid grid-cols-2 gap-2">
            <select
              name="pattern"
              className="p-2 rounded bg-gray-700 text-white"
              value={formData.pattern}
              onChange={handleChange}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              type="number"
              name="interval"
              min="1"
              className="p-2 rounded bg-gray-700 text-white"
              value={formData.interval}
              onChange={handleChange}
            />
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
