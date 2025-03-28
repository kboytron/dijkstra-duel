export const generateGraph = (numNodes) => {
  const nodes = [];
  const edges = [];
  const edgeSet = new Set();

  // Generate nodes
  for (let i = 0; i < numNodes; i++) {
    nodes.push({ id: i, label: `${i}` });
  }

  // Step 1: Create a tree to ensure connectivity (numNodes - 1 edges)
  const connected = new Set([0]);
  const unconnected = new Set(nodes.map(node => node.id).slice(1));

  while (unconnected.size > 0) {
    const from = [...connected][Math.floor(Math.random() * connected.size)];
    const to = [...unconnected][Math.floor(Math.random() * unconnected.size)];
    const weight = Math.floor(Math.random() * 50) + 1; // Weights from 1 to 50
    const edgeId = `${Math.min(from, to)}-${Math.max(from, to)}`;
    edges.push({
      id: edgeId,
      from,
      to,
      label: `${weight}`,
    });
    edgeSet.add(edgeId);
    connected.add(to);
    unconnected.delete(to);
  }

  // Step 2: Add additional edges to create cycles
  const targetEdges = Math.floor(numNodes * 1.25); // Aim for 1.25 times the number of nodes (e.g., 12-13 edges for 10 nodes)
  let currentEdges = edges.length;

  while (currentEdges < targetEdges) {
    const i = Math.floor(Math.random() * numNodes);
    const j = Math.floor(Math.random() * numNodes);
    if (i === j) continue;

    const edgeId = `${Math.min(i, j)}-${Math.max(i, j)}`;
    if (!edgeSet.has(edgeId)) {
      const weight = Math.floor(Math.random() * 50) + 1; // Weights from 1 to 50
      edges.push({
        id: edgeId,
        from: i,
        to: j,
        label: `${weight}`,
      });
      edgeSet.add(edgeId);
      currentEdges++;
    }
  }

  // Log the number of edges for debugging
  console.log(`Generated graph with ${numNodes} nodes and ${edges.length} edges`);

  return { nodes, edges };
};