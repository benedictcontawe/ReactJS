import React from "react";
import "./Tag.css"

const Tag = ({text, tag}) => {
    return (
        <button className="tag" onClick={() => tag(text)} >
                {text}
        </button>
    )
}

export default Tag