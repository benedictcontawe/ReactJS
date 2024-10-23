import React, { useState } from "react";
import "./TaskForm.css";
import Tag from "./Tag";

const TaskForm = () => {
    const [taskData, setTaskData] = useState({
        task: "",
        status: "todo"
    })
    const handleChange = e => {
        const {name, value} = e.target;
        setTaskData(prev => {
            return {...prev, [name]: value}
        })
        console.log(name, value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(taskData);
    }
    return (
        <header className="app_header">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="task"
                    className="task_input" 
                    placeholder="Enter your task" 
                    onChange={handleChange}
                />
                <div className="task_form_bottom_line">
                    <div>
                        <Tag text="HTML"></Tag> 
                        <Tag text="CSS"></Tag> 
                        <Tag text="Javascript"></Tag> 
                        <Tag text="React"></Tag> 
                    </div>
                    <div>
                        <select name="status" className="task_status" onChange={handleChange}>
                            <option value="todo">To Do</option>
                            <option value="doing">Doing</option>
                            <option value="done">Done</option>
                        </select>
                        <button type="submit" className="task_submit">+ Add Task</button>
                    </div>
                </div>
            </form>
        </header>
    )
}

export default TaskForm