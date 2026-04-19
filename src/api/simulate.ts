import type { WorkflowGraph } from '../types/workflow.types';

export const simulateGraph = async (graph: WorkflowGraph) => {
  // Mock simulation runner that generates a timeline/log for the frontend test panel
  const logs: Array<{ stepId: string; title: string; status: 'SUCCESS' | 'FAILED' | 'PENDING'; log: string }> = [];

  // Very basic walk just based on nodes array (a proper topological sort could go here)
  for (const [index, node] of graph.nodes.entries()) {
    // Artificial delay to simulate processing
    await new Promise(r => setTimeout(r, 500));
    
    logs.push({
      stepId: node.id || `node-${index}`,
      title: node.title || node.type,
      status: 'SUCCESS',
      log: `Successfully executed step ${node.title} of type ${node.type}`
    });
  }

  return logs;
};
