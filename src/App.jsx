import React, { useReducer, useState } from "react";
import "./App.css";
import countReducer from "./reducers/countReducer";

const App = () => {
  // const [count, setCount] = useState(0);
  const [count, dispatch] = useReducer(countReducer, 0);

  const increaseCount = () => {
    dispatch({ type: "INCREASE" });
  };

  const decreaseCount = () => {
    dispatch({ type: "DECREASE" });
  };

  const resetCount = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <div>
      <h1> {count} </h1>
      <button onClick={decreaseCount}>-</button>
      <button onClick={increaseCount}>+</button>
      <button onClick={resetCount}>Reset</button>
    </div>
  );
};

export default App;
