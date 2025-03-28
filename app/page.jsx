"use client";

import React, { useState, useMemo } from "react";
import Header from "../components/Header";
import GraphVisualizer from "../components/GraphVisualizer";
import Controls from "../components/Controls";
import { generateGraph } from "../utils/graphHelpers";
import { dijkstraLinear } from "../algorithms/dijkstraLinear";
import { dijkstraPriorityQueue } from "../algorithms/dijkstraPriorityQueue";

export default function Home() {
  const [numNodes, setNumNodes] = useState(20); // Increased to 20 nodes
  const [animationSpeed, setAnimationSpeed] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [linearSteps, setLinearSteps] = useState([]);
  const [pqSteps, setPqSteps] = useState([]);
  const [linearCurrentStep, setLinearCurrentStep] = useState(-1);
  const [pqCurrentStep, setPqCurrentStep] = useState(-1);

  const startNode = 0;

  const endNode = useMemo(() => {
    let randomEndNode;
    const maxAttempts = 100;
    let attempts = 0;

    const tempGraph = generateGraph(numNodes, startNode, null);

    while (attempts < maxAttempts) {
      randomEndNode = Math.floor(Math.random() * numNodes);
      if (randomEndNode === startNode) {
        attempts++;
        continue;
      }

      const isNeighbor = tempGraph.edges.some(
        (edge) =>
          (edge.from === startNode && edge.to === randomEndNode) ||
          (edge.from === randomEndNode && edge.to === startNode)
      );

      if (!isNeighbor) {
        return randomEndNode;
      }

      attempts++;
    }

    do {
      randomEndNode = Math.floor(Math.random() * numNodes);
      const isNeighbor = tempGraph.edges.some(
        (edge) =>
          (edge.from === startNode && edge.to === randomEndNode) ||
          (edge.from === randomEndNode && edge.to === startNode)
      );
    } while (randomEndNode === startNode || isNeighbor);

    return randomEndNode;
  }, [numNodes]);

  const graph = useMemo(() => generateGraph(numNodes, startNode, endNode), [numNodes, startNode, endNode]);

  const nodePositions = useMemo(() => {
    const width = 500;
    const height = 500;
    const minDistance = 50;
    const positions = [];
    const positionsMap = {};

    const getRandomPosition = () => {
      let attempts = 0;
      const maxAttempts = 100;
      while (attempts < maxAttempts) {
        const x = Math.random() * (width - 60) + 30;
        const y = Math.random() * (height - 60) + 30;
        let tooClose = false;

        for (const pos of positions) {
          const dx = pos.x - x;
          const dy = pos.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < minDistance) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          return { x, y };
        }
        attempts++;
      }

      return {
        x: Math.random() * (width - 60) + 30,
        y: Math.random() * (height - 60) + 30,
      };
    };

    graph.nodes.forEach((node) => {
      const { x, y } = getRandomPosition();
      positions.push({ x, y });
      positionsMap[node.id] = { x, y };
    });

    return positionsMap;
  }, [graph.nodes, numNodes]);

  const handleStart = () => {
    // Reset steps and state before starting a new run
    setLinearSteps([]);
    setPqSteps([]);
    setIsRunning(false);
    setLinearCurrentStep(-1);
    setPqCurrentStep(-1);

    setTimeout(() => {
      const linearResult = dijkstraLinear(graph, startNode, endNode);
      const pqResult = dijkstraPriorityQueue(graph, startNode, endNode);

      setLinearSteps(linearResult.steps.map((step, index) => ({
        ...step,
        path: index === linearResult.steps.length - 1 ? linearResult.path : null,
      })));
      setPqSteps(pqResult.steps.map((step, index) => ({
        ...step,
        path: index === pqResult.steps.length - 1 ? pqResult.path : null,
      })));

      setIsRunning(true);
    }, 100);
  };

  return (
    <>
      <Header />
      <main className="main">
        <Controls
          setNumNodes={setNumNodes}
          setAnimationSpeed={setAnimationSpeed}
          onStart={handleStart}
        />
        {(linearCurrentStep === linearSteps.length - 1 || pqCurrentStep === pqSteps.length - 1) && (
          <div
            style={{
              color: "#ffffff",
              textAlign: "center",
              margin: "20px 0",
              fontWeight: "bold",
            }}
          >
            Finished!
          </div>
        )}
        <div style={{ display: "flex", gap: "20px" }}>
          <div className="graph-container">
            <h2>Linear Search</h2>
            <GraphVisualizer
              graph={graph}
              identifier="linear-search-graph"
              numNodes={numNodes}
              steps={linearSteps}
              animationSpeed={animationSpeed}
              isRunning={isRunning}
              startNode={startNode}
              endNode={endNode}
              onStepChange={setLinearCurrentStep}
              nodePositions={nodePositions}
            />
          </div>
          <div className="graph-container">
            <h2>Priority Queue</h2>
            <GraphVisualizer
              graph={graph}
              identifier="priority-queue-graph"
              numNodes={numNodes}
              steps={pqSteps}
              animationSpeed={animationSpeed}
              isRunning={isRunning}
              startNode={startNode}
              endNode={endNode}
              onStepChange={setPqCurrentStep}
              nodePositions={nodePositions}
            />
          </div>
        </div>
      </main>
    </>
  );
}