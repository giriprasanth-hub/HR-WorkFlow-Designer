import type { WorkflowGraph } from '../types/workflow.types';

type SimStep = {
  stepId: string;
  title: string;
  nodeType: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  log: string;
};

/**
 * Simulates a workflow graph execution.
 * Performs a basic topological traversal using BFS from the Start node,
 * following edges in order.
 */
export const simulateGraph = async (graph: WorkflowGraph): Promise<SimStep[]> => {
  const logs: SimStep[] = [];

  if (!graph.nodes || graph.nodes.length === 0) {
    return logs;
  }

  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  const nodeById = new Map<string, any>();

  graph.nodes.forEach((node: any) => {
    adjacency.set(node.id || node.type, []);
    nodeById.set(node.id || node.type, node);
  });

  graph.edges.forEach((edge: any) => {
    const neighbors = adjacency.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacency.set(edge.source, neighbors);
  });

  // Find nodes with no incoming edges (Start candidates)
  const inDegree = new Map<string, number>();
  graph.nodes.forEach((n: any) => inDegree.set(n.id || n.type, 0));
  graph.edges.forEach((e: any) => {
    const key = e.target;
    inDegree.set(key, (inDegree.get(key) || 0) + 1);
  });

  // BFS traversal from zero-in-degree nodes
  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodeById.get(currentId);
    if (!node) continue;

    // Simulate processing delay for realism
    await new Promise((r) => setTimeout(r, 150));

    const stepLog = buildStepLog(node);
    logs.push({
      stepId: currentId,
      title: node.title || node.type,
      nodeType: node.type,
      status: 'SUCCESS',
      log: stepLog,
    });

    // Enqueue neighbors
    const neighbors = adjacency.get(currentId) || [];
    for (const neighbor of neighbors) {
      const newDeg = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0 && !visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  // Any unvisited nodes (e.g., disconnected or in a cycle)
  graph.nodes.forEach((node: any) => {
    const id = node.id || node.type;
    if (!visited.has(id)) {
      logs.push({
        stepId: id,
        title: node.title || node.type,
        nodeType: node.type,
        status: 'PENDING',
        log: `Node skipped – unreachable or part of a disconnected subgraph.`,
      });
    }
  });

  return logs;
};

function buildStepLog(node: any): string {
  const type: string = node.type || '';
  switch (type) {
    case 'StartNode':
      return `Workflow initiated. ${
        node.metadata?.length ? `Metadata: ${node.metadata.map((m: any) => `${m.key}=${m.value}`).join(', ')}.` : ''
      }`;
    case 'TaskNode':
      return `Task "${node.title}" assigned to ${node.assignee || 'Unassigned'}. Due: ${
        node.dueDate || 'no date set'
      }.`;
    case 'ApprovalNode':
      return `Approval requested from ${node.approverRole || 'Manager'}. ${
        node.autoApproveThreshold
          ? `Auto-approves after ${node.autoApproveThreshold} day(s).`
          : 'Manual approval required.'
      }`;
    case 'AutomatedStepNode':
      return `Automated action "${node.actionId || 'undefined'}" triggered. ${
        node.params && Object.keys(node.params).length > 0
          ? `Params: ${JSON.stringify(node.params)}.`
          : 'No parameters configured.'
      }`;
    case 'EndNode':
      return `Workflow completed. ${node.endMessage ? `Message: "${node.endMessage}".` : ''} ${
        node.isSummary ? 'Summary report generated.' : ''
      }`;
    default:
      return `Step of type "${type}" executed successfully.`;
  }
}
