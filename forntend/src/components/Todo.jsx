import { useState, useEffect } from "react";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

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

  // Use useEffect to fetch tasks when the component loads
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className='p-4 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold text-center mb-4'>Task Manager</h1>

      {/* Add Task Form */}
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
        <button className='bg-blue-500 text-white px-4 py-2 w-full'>
          Add Task
        </button>
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
            <div className='space-x-2'>
              <button className='bg-green-500 text-white px-2 py-1'>
                Edit
              </button>
              <button className='bg-red-500 text-white px-2 py-1'>
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