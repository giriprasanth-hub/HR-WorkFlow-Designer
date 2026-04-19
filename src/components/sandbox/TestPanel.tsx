import React, { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Play } from 'lucide-react';

export const SandboxPanel = () => {
  const { nodes, edges } = useWorkflowStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const simulate = async () => {
    setIsLoading(true);
    setIsOpen(true);
    try {
      const payload = { nodes: nodes.map(n => n.data), edges };
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setLogs(data.logs);
    } catch (e) {
      console.error(e);
      setLogs([{ stepId: 'error', status: 'FAILED', log: 'Simulation Request Failed' }]);
    }
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={simulate}
        disabled={isLoading || nodes.length === 0}
        className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 flex gap-2 items-center rounded-full shadow-lg z-10 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-4 h-4 fill-current" />
        <span className="font-semibold text-sm">Test Workflow</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-6 w-96 bg-white border border-slate-200 shadow-2xl rounded-lg p-0 z-30 flex flex-col h-[400px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-lg">
            <h3 className="font-bold text-slate-800">Execution Log</h3>
            <button onClick={() => setIsOpen(false)} className="text-xs text-indigo-600 hover:underline">Close</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {isLoading && <div className="text-sm text-slate-500 flex justify-center py-4">Running Sandbox...</div>}
            
            {!isLoading && logs.length === 0 && (
              <div className="text-sm text-slate-500 text-center py-4">No logs generated.</div>
            )}

            {logs.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 ${item.status === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'}`} />
                  {i !== logs.length - 1 && <div className="w-0.5 h-full bg-slate-200 mt-1" />}
                </div>
                <div className="pb-4">
                  <div className="font-semibold text-slate-700">{item.title}</div>
                  <div className="text-slate-500 text-xs mt-1">{item.log}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
