import React from "react";
import "./TaskColumn.css";
import TaskCard from "../components/TaskCard";

const TaskColumn = (props) => {
    console.log("TaskColumn props", props)
    const {text, icon} = props
    return (
        <section className='task_column'>
            <h2 className="task_column_heading">
                <img className="task_column_icon" src={icon} alt="" /> {text}
            </h2>
            <TaskCard />
        </section>
    )
}

export default TaskColumn