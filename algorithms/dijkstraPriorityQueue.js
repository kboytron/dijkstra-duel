import BinaryHeap from "../utils/BinaryHeap";

// Helper function to build an adjacency list from the graph
const buildAdjacencyList = (graph) => {
  const adjList = new Array(graph.nodes.length).fill(null).map(() => []);
  for (const edge of graph.edges) {
    adjList[edge.from].push({ to: edge.to, weight: parseInt(edge.label), id: edge.id });
  }
  return adjList;
};

export const dijkstraPriorityQueue = (graph, start, end) => {
  const nodes = graph.nodes.map((node) => node.id);
  const distances = new Array(nodes.length).fill(Infinity);
  const previous = new Array(nodes.length).fill(null);
  const visited = new Array(nodes.length).fill(false);
  const steps = [];

  const adjList = buildAdjacencyList(graph);

  const pq = new BinaryHeap();
  distances[start] = 0;
  let totalOperations = 0;

  totalOperations += pq.push(start, 0);

  while (pq.size() > 0) {
    const { item: minItem, ops } = pq.pop();
    const minNode = minItem.node;
    totalOperations += ops;

    totalOperations++; // Count the comparison for checking if visited
    if (visited[minNode]) continue;

    visited[minNode] = true;

    totalOperations++; // Count the comparison for checking if minNode === end
    if (minNode === end) {
      const path = [];
      let current = end;
      while (current !== null) {
        path.push(current);
        current = previous[current];
      }
      path.reverse();

      if (path[0] !== start) return { steps, path: null, distance: Infinity };

      steps.push({
        visited: visited.filter((v, idx) => v).map((_, idx) => idx),
        currentNode: null,
        edges: [],
        operations: totalOperations,
        path,
        distance: distances[end],
        action: `Path found: ${path.join(" -> ")}`,
      });

      return { steps, path, distance: distances[end] };
    }

    const exploredEdges = [];
    for (const { to: neighbor, weight, id } of adjList[minNode]) {
      const newDist = distances[minNode] + weight;

      totalOperations++; // Count the comparison for checking if newDist < distances[neighbor]
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = minNode;
        const pushOps = pq.push(neighbor, newDist);
        totalOperations += pushOps;
        exploredEdges.push({ id });
      }
    }

    steps.push({
      visited: visited.filter((v, idx) => v).map((_, idx) => idx),
      currentNode: minNode,
      edges: exploredEdges,
      operations: totalOperations,
      action: `Dequeued node ${minNode}, explored edges: ${exploredEdges.map(e => e.id).join(", ")}`,
    });
  }

  const path = [];
  let current = end;
  while (current !== null) {
    path.push(current);
    current = previous[current];
  }
  path.reverse();

  if (path[0] !== start) return { steps, path: null, distance: Infinity };

  steps.push({
    visited: visited.filter((v, idx) => v).map((_, idx) => idx),
    currentNode: null,
    edges: [],
    operations: totalOperations,
    path,
    distance: distances[end],
    action: `Path found: ${path.join(" -> ")}`,
  });

  return { steps, path, distance: distances[end] };
};