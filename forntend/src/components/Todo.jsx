import { useState, useEffect } from "react";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task to the backend
  const addTask = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks([...tasks, addedTask]); // Update the task list with the new task
        setNewTask({ title: "", description: "" }); // Reset the form
      } else {
        console.error("Error adding task:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete a task from the backend with confirmation
  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) {
      return; // If the user cancels, do nothing
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId)); // Remove the task from the state
      } else {
        console.error("Error deleting task:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Edit a task
  const editTask = (task) => {
    setIsEditing(true);
    setEditTaskId(task._id);
    setNewTask({ title: task.title, description: task.description });
  };

  // Save the edited task
  const saveTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${editTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(
          tasks.map((task) => (task._id === editTaskId ? updatedTask : task))
        ); // Update the task in the state
        setIsEditing(false);
        setEditTaskId(null);
        setNewTask({ title: "", description: "" }); // Reset the form
      } else {
        console.error("Error updating task:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Toggle the completed status of a task
  const toggleCompleted = async (taskId, currentStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: !currentStatus }),
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(
          tasks.map((task) => (task._id === taskId ? updatedTask : task))
        ); // Update the task in the state
      } else {
        console.error("Error toggling completed status:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling completed status:", error);
    }
  };

  // Use useEffect to fetch tasks when the component loads
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className='p-4 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold text-center mb-4'>Task Manager</h1>

      {/* Add/Edit Task Form */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Task Title'
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className='border p-2 w-full mb-2'
        />
        <textarea
          placeholder='Task Description'
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className='border p-2 w-full mb-2'></textarea>
        {isEditing ? (
          <button
            onClick={saveTask}
            className='bg-green-500 text-white px-4 py-2 w-full hover:bg-green-600 cursor-pointer'>
            Save Task
          </button>
        ) : (
          <button
            onClick={addTask}
            className='bg-blue-500 text-white px-4 py-2 w-full hover:bg-blue-600 cursor-pointer'>
            Add Task
          </button>
        )}
      </div>

      {/* Task List */}
      <ul className='space-y-4'>
        {tasks.map((task) => (
          <li
            key={task._id}
            className='border p-4 flex justify-between items-center'>
            <div>
              <h2 className='font-bold'>{task.title}</h2>
              <p>{task.description}</p>
            </div>
            <div className='space-x-2 flex items-center'>
              <input
                type='checkbox'
                checked={task.completed}
                onChange={() => toggleCompleted(task._id, task.completed)}
                className='mr-2'
              />
              <button
                onClick={() => editTask(task)}
                className='bg-green-500 text-white px-2 py-1 hover:bg-green-600 cursor-pointer'>
                Edit
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className='bg-red-500 text-white px-2 py-1 hover:bg-red-600 cursor-pointer'>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
