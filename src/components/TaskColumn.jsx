import React from "react";
import "./TaskColumn.css";
import TaskCard from "../components/TaskCard";

const TaskColumn = (props) => {
    console.log("TaskColumn props", props)
    const {text, icon, tasks, status} = props
    return (
        <section className='task_column'>
            <h2 className="task_column_heading">
                <img className="task_column_icon" src={icon} alt="" /> {text}
            </h2>
            {
                tasks.map( (task, index) => task.status === status && (
                    <TaskCard key ={index} text={task.task} tags={task.tags} />
                ) )
            }
        </section>
    )
}

export default TaskColumn