import React, { useState } from 'react';
import "./App.css";
import TaskForm from './components/TaskForm';
import TaskColumn from './components/TaskColumn';
import Todo from "./assets/direct-hit.png";
import Doing from "./assets/glowing-star.png"
import Done from "./assets/check-mark-button.png"

const App = () => {
  const [tasks, setTasks] = useState([])
  console.log("App", "tasks", tasks); 
  return (
    <div className='app'>
      <TaskForm setTasks={setTasks} />
      <main className='app_main'>
        <TaskColumn text="To do" icon={Todo} tasks={tasks} status="todo" />
        <TaskColumn text="Doing" icon={Doing} tasks={tasks} status="doing" />
        <TaskColumn text="Done" icon={Done} tasks={tasks} status="done" />
      </main>
    </div>
  )
}

export default App