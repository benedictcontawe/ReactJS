import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Card from './compose/Card.jsx'
import CreateTodo from './compose/CreateTodo.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <Card /> */}
    <CreateTodo />
  </StrictMode>,
)