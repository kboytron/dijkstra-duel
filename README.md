# Dijkstra Duel

**Dijkstra Duel** is an interactive web-based visualization tool created to demonstrate and compare the efficiency of two distinct implementations of Dijkstra’s algorithm—a foundational algorithm for finding shortest paths in graphs. It visually showcases the performance differences between using a linear search approach (complexity: O(n²)) and a priority queue with a binary heap (complexity: O((n + e) log n)).

---

## Overview

Inspired by coursework on algorithms, Dijkstra Duel was developed to highlight how data structures significantly impact algorithm performance. By allowing users to interact with two side-by-side visualizations, the project clearly illustrates the practical implications of algorithm efficiency.

---

## Key Features

- **Dual Visualization:** Compare the linear search and priority queue implementations in real-time.
- **Interactive Controls:** Adjust the number of nodes (5 to 25) and animation speed (100ms to 1000ms).
- **Real-time Performance Metrics:** See execution time and the total number of operations as the algorithms run.
- **Shortest-Path Tree (SPT):** Visual representation highlighting the shortest paths from the source node upon completion.

---

## Technical Stack

- **Framework:** Next.js, React
- **Graph Visualization:** `react-graph-vis`
- **Core Logic:** Custom JavaScript implementations of both Dijkstra algorithm variants

---

## Installation

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/kboytron/dijkstra-duel
cd dijkstra-duel

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## Usage

- Use sliders to set your preferred number of nodes and animation speed.
- Click **"Start Race"** to begin visualizing the algorithm comparison.
- Observe side-by-side animations and real-time metrics.

---

## Educational Purpose

The goal of Dijkstra Duel is educational—to clearly demonstrate how the choice of data structures affects algorithmic performance, providing visual reinforcement of theoretical concepts taught in computer science courses.


---

Feel free to explore, fork, and contribute!

