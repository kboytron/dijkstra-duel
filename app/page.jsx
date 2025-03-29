"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react"
import Header from "../components/Header";
import GraphVisualizer from "../components/GraphVisualizer";
import Controls from "../components/Controls";
import { generateGraph } from "../utils/graphHelpers";
import { dijkstraLinear } from "../algorithms/dijkstraLinear";
import { dijkstraPriorityQueue } from "../algorithms/dijkstraPriorityQueue";

export default function Home() {
  const [numNodes, setNumNodes] = useState(5);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [isRunning, setIsRunning] = useState(false);
  const [linearSteps, setLinearSteps] = useState([]);
  const [pqSteps, setPqSteps] = useState([]);
  const [linearCurrentStep, setLinearCurrentStep] = useState(-1);
  const [pqCurrentStep, setPqCurrentStep] = useState(-1);
  const [linearSptEdges, setLinearSptEdges] = useState([]);
  const [pqSptEdges, setPqSptEdges] = useState([]);
  const [linearFinished, setLinearFinished] = useState(false);
  const [pqFinished, setPqFinished] = useState(false);

  const startNode = 0;

  const graph = useMemo(() => generateGraph(numNodes, startNode), [numNodes, startNode]);

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

  useEffect(() => {
    if (!isRunning) {
      setLinearFinished(false);
      setPqFinished(false);
    }
  }, [isRunning]);

  const handleStart = () => {
    setLinearSteps([]);
    setPqSteps([]);
    setLinearSptEdges([]);
    setPqSptEdges([]);
    setLinearCurrentStep(-1);
    setPqCurrentStep(-1);
    setIsRunning(false);

    setTimeout(() => {
      const linearResult = dijkstraLinear(graph, startNode);
      const pqResult = dijkstraPriorityQueue(graph, startNode);

      const linearSpt = [];
      for (let node = 0; node < graph.nodes.length; node++) {
        if (linearResult.previous[node] !== null) {
          const edge = graph.edges.find(
            (e) => e.from === linearResult.previous[node] && e.to === node
          );
          if (edge) {
            linearSpt.push({ id: edge.id });
          }
        }
      }

      const pqSpt = [];
      for (let node = 0; node < graph.nodes.length; node++) {
        if (pqResult.previous[node] !== null) {
          const edge = graph.edges.find(
            (e) => e.from === pqResult.previous[node] && e.to === node
          );
          if (edge) {
            pqSpt.push({ id: edge.id });
          }
        }
      }

      setLinearSteps(linearResult.steps);
      setPqSteps(pqResult.steps);
      setLinearSptEdges(linearSpt);
      setPqSptEdges(pqSpt);
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
        <div style={{ display: "flex", gap: "20px" }}>
          <div className="graph-container">
            <h2>Linear Search</h2>
            {linearFinished && isRunning && linearCurrentStep === linearSteps.length - 1 && (
              <div
                style={{
                  color: "#ffffff",
                  textAlign: "center",
                  margin: "10px 0",
                  fontWeight: "bold",
                }}
              >
                <div>Linear Search Finished!</div>
                <div>Showing Shortest-Path Tree</div>
              </div>
            )}
            <GraphVisualizer
              graph={graph}
              identifier="linear-search-graph"
              numNodes={numNodes}
              steps={linearSteps}
              animationSpeed={animationSpeed}
              isRunning={isRunning}
              startNode={startNode}
              onStepChange={(step) => {
                setLinearCurrentStep(step);
                if (step === linearSteps.length - 1) {
                  setLinearFinished(true);
                }
              }}
              nodePositions={nodePositions}
              sptEdges={linearSptEdges}
            />
          </div>
          <div className="graph-container">
            <h2>Priority Queue</h2>
            {pqFinished && isRunning && pqCurrentStep === pqSteps.length - 1 && (
              <div
                style={{
                  color: "#ffffff",
                  textAlign: "center",
                  margin: "10px 0",
                  fontWeight: "bold",
                }}
              >
                <div>Priority Queue Finished!</div>
                <div>Showing Shortest-Path Tree</div>
              </div>
            )}
            <GraphVisualizer
              graph={graph}
              identifier="priority-queue-graph"
              numNodes={numNodes}
              steps={pqSteps}
              animationSpeed={animationSpeed}
              isRunning={isRunning}
              startNode={startNode}
              onStepChange={(step) => {
                setPqCurrentStep(step);
                if (step === pqSteps.length - 1) {
                  setPqFinished(true);
                }
              }}
              nodePositions={nodePositions}
              sptEdges={pqSptEdges}
            />
          </div>
        </div>
        <footer style={{ textAlign: "center", marginTop: "20px", color: "#888888" }}>
          <p>
            Made by             <a href="https://kboytron.dev" target="_blank" rel="noopener noreferrer" style={{ color: "#00b7eb" }}>
              Karan Singh
            </a> in 2025 •{" "}
            <a href="https://github.com/kboytron/dijkstra-duel" target="_blank" rel="noopener noreferrer" style={{ color: "#00b7eb" }}>
              GitHub
            </a>{" "}
            •{" "}

          </p>
        </footer>
      </main>
      <Analytics />
    </>
  );
}