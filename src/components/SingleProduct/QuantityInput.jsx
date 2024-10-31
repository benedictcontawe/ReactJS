import React from 'react'
import './QuantityInput.css'

const QuantityInput = () => {
  return (
    <React.Fragment>
        <button className="quantity_input_button" disabled> - </button>
        <p className="quantity_input_count">1</p>
        <button className="quantity_input_button" > + </button>
    </React.Fragment>
  )
}

export default QuantityInput