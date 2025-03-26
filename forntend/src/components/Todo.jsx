import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const BASE_URL = "https://algo-root-task-mange.onrender.com/api";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Swal.fire(
        "Error",
        "Failed to fetch tasks. Please try again later.",
        "error"
      );
    }
  };

  // Add a new task to the backend
  const addTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      Swal.fire("Error", "Title and description cannot be empty.", "error");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks([...tasks, addedTask]);
        setNewTask({ title: "", description: "" });
        Swal.fire("Success", "Task added successfully!", "success");
      } else {
        console.error("Error adding task:", response.statusText);
        Swal.fire("Error", "Failed to add task. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      Swal.fire("Error", "Failed to add task. Please try again.", "error");
    }
  };

  // Delete a task from the backend with confirmation
  const deleteTask = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setTasks(tasks.filter((task) => task._id !== taskId));
            Swal.fire("Deleted!", "Your task has been deleted.", "success");
          } else {
            console.error("Error deleting task:", response.statusText);
            Swal.fire(
              "Error",
              "Failed to delete task. Please try again.",
              "error"
            );
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire(
            "Error",
            "Failed to delete task. Please try again.",
            "error"
          );
        }
      }
    });
  };

  // Edit a task
  const editTask = (task) => {
    setIsEditing(true);
    setEditTaskId(task._id);
    setNewTask({ title: task.title, description: task.description });
  };

  // Save the edited task
  const saveTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      Swal.fire("Error", "Title and description cannot be empty.", "error");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/tasks/${editTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(
          tasks.map((task) => (task._id === editTaskId ? updatedTask : task))
        );
        setIsEditing(false);
        setEditTaskId(null);
        setNewTask({ title: "", description: "" });
        Swal.fire("Success", "Task updated successfully!", "success");
      } else {
        console.error("Error updating task:", response.statusText);
        Swal.fire("Error", "Failed to update task. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("Error", "Failed to update task. Please try again.", "error");
    }
  };

  // Toggle the completed status of a task
  const toggleCompleted = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(
          tasks.map((task) => (task._id === taskId ? updatedTask : task))
        );
      } else {
        console.error("Error toggling completed status:", response.statusText);
        Swal.fire(
          "Error",
          "Failed to update task status. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error toggling completed status:", error);
      Swal.fire(
        "Error",
        "Failed to update task status. Please try again.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className='p-6 max-w-lg mx-auto'>
      {/* Main container */}
      <div className='bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg shadow-lg p-6'>
        <h1 className='text-3xl font-extrabold text-white text-center mb-6'>
          Task Manager
        </h1>

        {/* Add/Edit Task Form */}
        <div className='bg-gradient-to-r from-slate-500 to-gray-600 rounded-lg p-4 shadow mb-6'>
          <input
            type='text'
            placeholder='Task Title'
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className='w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent text-white placeholder-white'
          />
          <textarea
            placeholder='Task Description'
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className='w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent text-white placeholder-white'></textarea>
          {isEditing ? (
            <button
              onClick={saveTask}
              className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition duration-200 cursor-pointer'>
              Save Task
            </button>
          ) : (
            <button
              onClick={addTask}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200 cursor-pointer'>
              Add Task
            </button>
          )}
        </div>

        {/* Task List */}
        <ul className='space-y-4'>
          {tasks.length === 0 && (
            <p className='text-center text-white'>No tasks yet.</p>
          )}
          {tasks.map((task) => (
            <li
              key={task._id}
              className='bg-gradient-to-r from-slate-500 to-gray-600 p-4 rounded-lg shadow flex justify-between items-center transition transform hover:scale-105'>
              <div>
                <h2
                  className={`font-bold text-lg ${
                    task.completed ? "line-through text-gray-300" : "text-white"
                  }`}>
                  {task.title}
                </h2>
                <p
                  className={`text-sm ${
                    task.completed ? "line-through text-gray-300" : "text-white"
                  }`}>
                  {task.description}
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={task.completed}
                  onChange={() => toggleCompleted(task._id, task.completed)}
                  className='h-5 w-5 text-blue-600 cursor-pointer'
                />
                <button
                  onClick={() => editTask(task)}
                  className='bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-200 cursor-pointer'>
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200 cursor-pointer'>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
