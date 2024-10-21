import React, { useState } from "react";

const CreateTodo = () => {
    /*
    const countArray = useState(0);
    const count = countArray[0];
    const setCount = countArray[1];
    */
    const [count, setCount] = useState(0)
    const [input, setInput] = useState("")
    const tasks = ["Task 1", "Task 2", "Task 3"]


    const handleClick = () => {
        console.log("Add Task", count);
        setCount(count + 1);
    }
    const handleChange = (event) => {
        setInput(event.target.value);
    }
    
    const hideButton = false
    const styles = {
        backgroundColor: "red"
    }
    const countTasks = () => {
        /*
        if (tasks === 0) {
            return "No tasks available"
        } else {
            return `Tasks: ${tasks}`
        }
        */
       return count === 0 ? "No tasks available" : `Tasks: ${count}`
    }
    return (
        <React.Fragment>
            <h1 style={styles}>Tasks: {countTasks()}</h1>
            <h1 style={{backgroundColor: "blue"}}>Create New ToDo from Here</h1>
            <input type="text" onChange={handleChange} />
            <button className='btn' disabled={ hideButton } onClick={ handleClick } value="Add Task Button">
                Add Task
            </button>
            <h2>Input: {input}</h2>
            <ul>
                {
                    tasks.map(task => (
                        <li key={task} >{task}</li>
                    ))
                }
            </ul>
        </React.Fragment>
    )
}

export default CreateTodo