import React from "react";
import "./Tag.css"

const Tag = (props) => {
    return (
        <button className="tag">{props.name}</button>
    )
}

export default Tag