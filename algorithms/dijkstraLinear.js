// Helper function to build an adjacency list from the graph
const buildAdjacencyList = (graph) => {
  const adjList = new Array(graph.nodes.length).fill(null).map(() => []);
  for (const edge of graph.edges) {
    adjList[edge.from].push({ to: edge.to, weight: parseInt(edge.label), id: edge.id });
  }
  return adjList;
};

export const dijkstraLinear = (graph, start, end) => {
  const nodes = graph.nodes.map((node) => node.id);
  const distances = new Array(nodes.length).fill(Infinity);
  const previous = new Array(nodes.length).fill(null);
  const visited = new Array(nodes.length).fill(false);
  const steps = [];

  const adjList = buildAdjacencyList(graph);

  distances[start] = 0;

  let totalOperations = 0;

  while (true) {
    let minDist = Infinity;
    let minNode = null;

    for (let i = 0; i < nodes.length; i++) {
      if (!visited[i]) {
        totalOperations++; // Count the comparison for checking if visited
        totalOperations++; // Count the comparison for checking if distance is less than minDist
        if (distances[i] < minDist) {
          minDist = distances[i];
          minNode = i;
        }
      }
    }

    if (minNode === null) break;

    visited[minNode] = true;

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
        exploredEdges.push({ id });
      }
    }

    steps.push({
      visited: visited.filter((v, idx) => v).map((_, idx) => idx),
      currentNode: minNode,
      edges: exploredEdges,
      operations: totalOperations,
      action: `Processed node ${minNode}, explored edges: ${exploredEdges.map(e => e.id).join(", ")}`,
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