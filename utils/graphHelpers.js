export const generateGraph = (numNodes, startNode) => {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    label: `${i}`,
  }));

  const edges = [];
  const edgeSet = new Set();

  const addEdge = (from, to, weight) => {
    const edgeKey = `${Math.min(from, to)}-${Math.max(from, to)}`;
    if (!edgeSet.has(edgeKey) && from !== to) {
      edges.push({
        from,
        to,
        label: `${weight}`,
        id: `${from}-${to}`,
      });
      edgeSet.add(edgeKey);
    }
  };

  for (let i = 0; i < numNodes - 1; i++) {
    const weight = Math.floor(Math.random() * 50) + 1;
    addEdge(i, i + 1, weight);
  }

  const additionalEdges = numNodes * 2;
  for (let i = 0; i < additionalEdges; i++) {
    const from = Math.floor(Math.random() * numNodes);
    const to = Math.floor(Math.random() * numNodes);
    const weight = Math.floor(Math.random() * 50) + 1;
    addEdge(from, to, weight);
  }

  return { nodes, edges };
};