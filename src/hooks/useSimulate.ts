import { useState, useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export interface SimulationStep {
  stepId: string;
  title: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'SKIPPED';
  log: string;
  nodeType?: string;
}

export interface SimulationResult {
  logs: SimulationStep[];
  success: boolean;
}

/**
 * Custom hook that manages the /api/simulate fetch call,
 * loading state, and response logs.
 */
export const useSimulate = () => {
  const { nodes, edges } = useWorkflowStore();
  const [logs, setLogs] = useState<SimulationStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runSimulation = useCallback(async () => {
    setIsLoading(true);
    setHasRun(true);
    setLogs([]);

    try {
      const payload = {
        nodes: nodes.map((n) => ({ ...n.data, id: n.id })),
        edges: edges.map((e) => ({ source: e.source, target: e.target })),
      };

      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data: SimulationResult = await response.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      setLogs([
        {
          stepId: 'error',
          title: 'Simulation Error',
          status: 'FAILED',
          log: err?.message || 'Simulation request failed – check the console.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [nodes, edges]);

  const reset = useCallback(() => {
    setLogs([]);
    setHasRun(false);
  }, []);

  return { logs, isLoading, hasRun, runSimulation, reset };
};
