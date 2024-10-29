import React from 'react'
import "./Loader.css"

const Loader = () => {
  return (
    <div>
        <h3>Loading. . .</h3> 
        <div class="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
    </div>
  )
}

export default Loader