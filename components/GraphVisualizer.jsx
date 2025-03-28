"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Graph = dynamic(() => import("react-graph-vis"), { ssr: false });

const GraphVisualizer = ({ graph, identifier, numNodes, steps, animationSpeed, isRunning, startNode, onStepChange, nodePositions, sptEdges }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isRunning) {
      setCurrentStep(-1);
      setStartTime(Date.now());
      setElapsedTime(0);
      setIsFinished(false);
    } else {
      setCurrentStep(-1);
    }
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || !startTime || isFinished) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, startTime, isFinished]);

  useEffect(() => {
    if (!isRunning || !steps || steps.length === 0) return;

    if (currentStep < steps.length - 1) {
      const step = steps[currentStep + 1] || steps[0];
      const prevStep = currentStep >= 0 ? steps[currentStep] : null;
      const operationsInStep = prevStep ? step.operations - prevStep.operations : step.operations;

      const baseTime = animationSpeed;
      const scaledTime = Math.max(100, baseTime * (operationsInStep / 50));

      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, scaledTime);
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
      setElapsedTime(Date.now() - startTime);
    }
  }, [currentStep, steps, animationSpeed, isRunning, startTime]);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const currentOperations = steps && currentStep >= 0 && currentStep < steps.length && steps[currentStep] ? steps[currentStep].operations : 0;


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
    return { ...node, color, x, y };
  });

  currentGraph.edges = graph.edges.map((edge) => ({
    ...edge,
    color: "#888888",
  }));

  if (steps && steps.length > 0 && currentStep >= 0 && currentStep < steps.length && steps[currentStep]) {
    const { visited, currentNode, edges: exploredEdges } = steps[currentStep];

    visited.forEach((nodeId) => {
      if (nodeId !== startNode) {
        const node = currentGraph.nodes.find((n) => n.id === nodeId);
        if (node) {
          node.color = {
            background: "transparent",
            border: "#cccccc",
            borderWidth: 2,
          };
        }
      }
    });

    if (currentNode !== null && currentNode !== startNode) {
      const node = currentGraph.nodes.find((n) => n.id === currentNode);
      if (node) {
        node.color = {
          background: "transparent",
          border: "#ffffff",
          borderWidth: 2,
          highlight: { background: "transparent", border: "#ffffff", borderWidth: 2 },
        };
      }
    }

    exploredEdges.forEach(({ id }) => {
      const edge = currentGraph.edges.find((e) => e.id === id);
      if (edge) {
        edge.color = "#00b7eb"; 
        edge.width = 2;
      }
    });

    if (currentStep === steps.length - 1 && sptEdges && sptEdges.length > 0) {
      sptEdges.forEach(({ id }) => {
        const edge = currentGraph.edges.find((e) => e.id === id);
        if (edge) {
          edge.color = "#00b7eb"; 
          edge.width = 3;
        }
      });
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
        strokeColor: "#000000",
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