import React from 'react';
import "./App.css";
import TaskForm from './compose/TaskForm';
import TaskColumn from './compose/TaskColumn';
import Todo from "./assets/direct-hit.png";
import Doing from "./assets/glowing-star.png"
import Done from "./assets/check-mark-button.png"

const App = () => {
  return (
    <div className='app'>
      <TaskForm />
      <main className='app_main'>
        <TaskColumn text="To do" icon={Todo} />
        <TaskColumn text="Doing" icon={Doing}/>
        <TaskColumn text="Done" icon={Done}/>
      </main>
    </div>
  )
}

export default App