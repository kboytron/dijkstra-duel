"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Graph component with SSR disabled
const Graph = dynamic(() => import("react-graph-vis"), { ssr: false });

const GraphVisualizer = ({ graph, identifier, numNodes, steps, animationSpeed, isRunning, startNode, endNode, onStepChange, nodePositions }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Reset the animation when isRunning changes
  useEffect(() => {
    if (isRunning) {
      setCurrentStep(-1);
      setStartTime(Date.now());
      setElapsedTime(0);
      setIsFinished(false);
    }
  }, [isRunning]);

  // Update elapsed time every 100ms, but stop when finished
  useEffect(() => {
    if (!isRunning || !startTime || isFinished) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, startTime, isFinished]);

  // Animate the steps (independent for each graph)
  useEffect(() => {
    if (!isRunning || !steps || steps.length === 0) return;

    if (currentStep < steps.length - 1) {
      const step = steps[currentStep + 1] || steps[0];
      const prevStep = currentStep >= 0 ? steps[currentStep] : null;
      const operationsInStep = prevStep ? step.operations - prevStep.operations : step.operations;

      // Scale the animation time based on the number of operations in this step
      const baseTime = animationSpeed; // 300ms as the base time
      const scaledTime = Math.max(100, baseTime * (operationsInStep / 50)); // Scale based on operations, with a minimum of 100ms

      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, scaledTime);
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
      setElapsedTime(Date.now() - startTime);
    }
  }, [currentStep, steps, animationSpeed, isRunning, startTime]);

  // Report the current step to the parent
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  // Get the current number of operations and final distance
  const currentOperations = steps && steps[currentStep] ? steps[currentStep].operations : 0;
  const finalDistance = steps && steps[steps.length - 1] ? steps[steps.length - 1].distance : null;

  // Prepare the graph data for rendering
  const currentGraph = { nodes: [], edges: [] };

  currentGraph.nodes = graph.nodes.map((node) => {
    const { x, y } = nodePositions[node.id];
    let color = {
      background: "transparent",
      border: "#ffffff",
      borderWidth: 2,
    };
    if (node.id === startNode) {
      color = { background: "#00ff00", border: "#333333" };
    }
    if (node.id === endNode) {
      color = { background: "#ff0000", border: "#333333" };
    }
    return { ...node, color, x, y };
  });

  currentGraph.edges = graph.edges.map((edge) => ({
    ...edge,
    color: "#888888",
  }));

  // Apply highlights based on the current step
  if (steps && steps.length > 0 && currentStep >= 0 && steps[currentStep]) {
    const { visited, currentNode, edges: exploredEdges } = steps[currentStep];

    // Update colors for visited nodes
    visited.forEach((nodeId) => {
      if (nodeId !== startNode && nodeId !== endNode) {
        const node = currentGraph.nodes.find(n => n.id === nodeId);
        if (node) {
          node.color = {
            background: "transparent",
            border: "#cccccc",
            borderWidth: 2,
          };
        }
      }
    });

    // Update color for the current node
    if (currentNode !== null && currentNode !== startNode && currentNode !== endNode) {
      const node = currentGraph.nodes.find(n => n.id === currentNode);
      if (node) {
        node.color = {
          background: "transparent",
          border: "#ffffff",
          borderWidth: 2,
          highlight: { background: "transparent", border: "#ffffff", borderWidth: 2 },
        };
      }
    }

    // Highlight explored edges
    exploredEdges.forEach(({ id }) => {
      const edge = currentGraph.edges.find((e) => e.id === id);
      if (edge) {
        edge.color = "#00b7eb";
        edge.width = 2;
      }
    });

    // Highlight the final path (only in the correct direction)
    if (currentStep === steps.length - 1 && steps[currentStep].path) {
      const path = steps[currentStep].path;
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const edge = currentGraph.edges.find(
          (e) => e.from === from && e.to === to
        );
        if (edge) {
          edge.color = "#00b7eb";
          edge.width = 3;
        }
      }
    }
  }

  const options = {
    layout: {
      hierarchical: false,
      improvedLayout: false,
    },
    edges: {
      font: { 
        color: "#ffffff",
        size: 16,
        strokeWidth: 1,
        strokeColor: "#000000"
      },
      smooth: { type: "continuous" },
    },
    nodes: {
      font: { color: "#ffffff", size: 16 },
      shape: "dot",
      size: 12,
    },
    physics: {
      enabled: false,
    },
    height: "500px",
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ color: "#ffffff", textAlign: "center", marginBottom: "10px" }}>
        Time: {(elapsedTime / 1000).toFixed(2)}s | Operations: {currentOperations}
        {isFinished && finalDistance !== null && finalDistance !== Infinity && (
          <> | Distance: {finalDistance}</>
        )}
      </div>
      <Graph
        key={`graph-${identifier}-${numNodes}`}
        graph={currentGraph}
        options={options}
        identifier={identifier}
      />
    </div>
  );
};

export default GraphVisualizer;