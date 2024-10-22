import React from "react";
import "./Tag.css"

const Tag = (props) => {
    console.log("Tag props", props)
    return (
        <button className="tag">{props.text}</button>
    )
}

export default Tag