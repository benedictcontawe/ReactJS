import React from 'react'
import "./TaskCard.css"
import Tag from './Tag'
import deleteIcon from '../assets/delete.png'

const TaskCard = ({text, tags,}) => {
  console.log("TaskCard", "tags", tags);
  return (
    <article className='task_card'>
        <p className='task_text'>{text}</p>
        <div className='task_card_bottom_line'>
            <div className='task_card_tags'>
                {
                  tags.map((tag, index) => (
                    <Tag key={index} text={tag} selected={false} />
                  ))
                }
            </div>
            <div className='task_delete'>
                <img src={deleteIcon} className='delete_icon' />
            </div>
        </div>
    </article>
  )
}

export default TaskCard