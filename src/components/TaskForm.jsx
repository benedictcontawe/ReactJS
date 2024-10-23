import React, { useState } from "react";
import "./TaskForm.css";
import Tag from "./Tag";

const TaskForm = () => {
    const [taskData, setTaskData] = useState({
        task: "",
        status: "todo",
        tags: [],
    })
    const checkTag = (tag) => {
        console.log("checkTag", tag, taskData.tags);
        return taskData.tags.some(item => item === tag)
    }
    const selectTag = (tag) => {
        console.log("selectTag", tag);
        if(taskData.tags.some((item) => item === tag)) {
            const filterTags = taskData.tags.filter((item) => item !== tag);
            setTaskData((prev) => {
                return { ...prev, tags: filterTags };
            })
        } else {
            setTaskData((prev) => {
                return { ...prev, tags: [...prev.tags, tag] }
            })
        }
    }
    const handleChange = e => {
        console.log("handleChange", name, value);
        const {name, value} = e.target;
        setTaskData(prev => {
            return {...prev, [name]: value}
        })
    }
    const handleSubmit = (e) => {
        console.log("handleSubmit", taskData);
        e.preventDefault();
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
                        <Tag text="HTML" tag={selectTag} selected={checkTag("HTML")} />
                        <Tag text="CSS" tag={selectTag} selected={checkTag("CSS")} />
                        <Tag text="JavaScript" tag={selectTag} selected={checkTag("JavaScript")} />
                        <Tag text="React" tag={selectTag} selected={checkTag("React")} />
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