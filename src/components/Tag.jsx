import React from "react";
import "./Tag.css"

const Tag = ({text, tag, selected}) => {
    const tagStyle = {
        HTML: {backgroundColor: "#FDA821"},
        CSS: {backgroundColor: "#15D4C8"},
        JavaScript: {backgroundColor: "#FFD12C"},
        React: {backgroundColor: "#4CDAFC"},
        default: {backgroundColor: "#F9F9F9"},
    }
    return (
        <button type='button' className="tag" style={selected ? tagStyle[text] : tagStyle.default} onClick={() => tag(text)} >
                {text}
        </button>
    )
}

export default Tag