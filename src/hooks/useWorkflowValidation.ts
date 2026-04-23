import { useMemo } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { NodeType } from '../types/workflow.types';

export interface ValidationError {
  nodeId: string | null; // null = graph-level error
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validates the workflow graph and returns a list of validation errors/warnings.
 * Checks:
 * - Start node is present
 * - Start node has no incoming edges (it's truly a start)
 * - End node is present
 * - No orphan nodes (nodes with zero connections)
 * - No cycles (simple DFS)
 */
export const useWorkflowValidation = () => {
  const { nodes, edges } = useWorkflowStore();

  const errors: ValidationError[] = useMemo(() => {
    const errs: ValidationError[] = [];

    if (nodes.length === 0) return errs;

    // --- Check start node ---
    const startNodes = nodes.filter((n) => n.data.type === NodeType.START);
    if (startNodes.length === 0) {
      errs.push({
        nodeId: null,
        message: 'Workflow must have a Start node.',
        severity: 'error',
      });
    } else if (startNodes.length > 1) {
      errs.push({
        nodeId: null,
        message: 'Workflow should have only one Start node.',
        severity: 'warning',
      });
    } else {
      // Start node must have no incoming edges
      const startId = startNodes[0].id;
      const hasIncoming = edges.some((e) => e.target === startId);
      if (hasIncoming) {
        errs.push({
          nodeId: startId,
          message: 'Start node must not have incoming connections.',
          severity: 'error',
        });
      }
    }

    // --- Check end node ---
    const endNodes = nodes.filter((n) => n.data.type === NodeType.END);
    if (endNodes.length === 0) {
      errs.push({
        nodeId: null,
        message: 'Workflow must have an End node.',
        severity: 'error',
      });
    }

    // --- Check orphan nodes (no edges at all) ---
    if (nodes.length > 1) {
      nodes.forEach((node) => {
        const hasEdge = edges.some(
          (e) => e.source === node.id || e.target === node.id
        );
        if (!hasEdge) {
          errs.push({
            nodeId: node.id,
            message: `"${node.data.title || node.data.type}" is not connected to the workflow.`,
            severity: 'warning',
          });
        }
      });
    }

    // --- Cycle detection (DFS) ---
    const adjacency = new Map<string, string[]>();
    nodes.forEach((n) => adjacency.set(n.id, []));
    edges.forEach((e) => {
      const neighbors = adjacency.get(e.source) || [];
      neighbors.push(e.target);
      adjacency.set(e.source, neighbors);
    });

    const visited = new Set<string>();
    const inStack = new Set<string>();
    let hasCycle = false;

    const dfs = (nodeId: string) => {
      if (inStack.has(nodeId)) { hasCycle = true; return; }
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      inStack.add(nodeId);
      for (const neighbor of (adjacency.get(nodeId) || [])) {
        dfs(neighbor);
      }
      inStack.delete(nodeId);
    };

    nodes.forEach((n) => {
      if (!visited.has(n.id)) dfs(n.id);
    });

    if (hasCycle) {
      errs.push({
        nodeId: null,
        message: 'Workflow contains a cycle. Execution may loop indefinitely.',
        severity: 'error',
      });
    }

    return errs;
  }, [nodes, edges]);

  const errorNodeIds = useMemo(
    () => new Set(errors.filter((e) => e.nodeId).map((e) => e.nodeId as string)),
    [errors]
  );

  const hasErrors = errors.some((e) => e.severity === 'error');
  const hasWarnings = errors.some((e) => e.severity === 'warning');

  return { errors, errorNodeIds, hasErrors, hasWarnings };
};
