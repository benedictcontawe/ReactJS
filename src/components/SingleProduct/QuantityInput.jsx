import React, { useState, useRef, useEffect } from 'react';
import './QuantityInput.css'

const QuantityInput = () => {
  const [quantity, setQuantity] = useState(1);
  const decrementButtonRef = useRef(null);
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };
  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };
  useEffect(() => {
    if (quantity <= 0) {
      decrementButtonRef.current.disabled = true;
    } else {
      decrementButtonRef.current.disabled = false;
    }
  }, [quantity]);
  return (
    <React.Fragment>
        <button className="quantity_input_button" onClick={handleDecrement} ref={decrementButtonRef} > - </button>
        <p className="quantity_input_count">{quantity}</p>
        <button className="quantity_input_button" onClick={handleIncrement} > + </button>
    </React.Fragment>
  )
}

export default QuantityInput