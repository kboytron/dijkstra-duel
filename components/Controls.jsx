import React, { useState } from "react";

const Controls = ({ setNumNodes, setAnimationSpeed, onStart }) => {
  const [numNodesValue, setNumNodesValue] = useState(5);
  const [animationSpeedValue, setAnimationSpeedValue] = useState(500);

  const handleNumNodesChange = (e) => {
    const value = parseInt(e.target.value);
    setNumNodesValue(value);
    setNumNodes(value);
  };

  const handleAnimationSpeedChange = (e) => {
    const value = parseInt(e.target.value);
    setAnimationSpeedValue(value);
    setAnimationSpeed(value);
  };

  return (
    <div className="controls">
      <label>
        Number of Nodes: <span>{numNodesValue}</span>
        <input
          type="range"
          min="5"
          max="25"
          value={numNodesValue}
          onChange={handleNumNodesChange}
        />
      </label>
      <label>
        Animation Speed: <span>{animationSpeedValue}ms</span>
        <input
          type="range"
          min="100"
          max="1000"
          step="100"
          value={animationSpeedValue}
          onChange={handleAnimationSpeedChange}
        />
      </label>
      <button onClick={onStart}>Start Race</button>
    </div>
  );
};

export default Controls;