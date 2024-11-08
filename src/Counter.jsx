import React, { memo } from "react";

const Counter = ({ counter, increaseCounter }) => {
  console.log("Counter Component Re-render!");
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {}
  return (
    <div>
      <h2>Counter: {counter}</h2>
      <button onClick={increaseCounter}>Increase</button>
    </div>
  );
};

export default memo(Counter);
