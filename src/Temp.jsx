import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const expensiveCalculation = (num) => {
  console.log(`Calculating for ${num}...`);
  for (let i = 0; i < 1000000000; i++) {
    num += 1;
  }
  return num;
};

const App = () => {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = expensiveCalculation(count);
    setTotal(sum);
  }, [count]);

  return (
    <div className="app">
      <div>
        <button onClick={() => setCount(count - 1)}>-</button>
        <span> {count} </span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <h3>Total = {total}</h3>

      <div>
        <h4>Theme: {theme ? "Dark" : "Light"}</h4>
        <button onClick={() => setTheme(!theme)}>Toggle Theme</button>
      </div>
    </div>
  );
};

export default App;
