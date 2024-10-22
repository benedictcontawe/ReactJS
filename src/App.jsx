import React from 'react';
import "./App.css";
import TaskForm from './compose/TaskForm';

const App = () => {
  return (
    <div className='app'>
      <TaskForm />
      <main className='app_main'>
        <section className='task_column'>Section 1</section>
        <section className='task_column'>Section 2</section>
        <section className='task_column'>Section 3</section>
      </main>
    </div>
  )
}

export default App