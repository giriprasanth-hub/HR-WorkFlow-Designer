import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWorkflowStore } from '../../store/workflowStore';
import { nodeRegistry } from '../nodes/nodeRegistry';
import { NodeType } from '../../types/workflow.types';
import { X } from 'lucide-react';

const FormElement = ({ node, automations }: { node: any, automations: any[] }) => {
  const { updateNode } = useWorkflowStore();
  const registryEntry = nodeRegistry[node.type as NodeType];
  
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registryEntry.schema),
    defaultValues: node.data
  });

  const onSubmit = (data: any) => {
    updateNode(node.id, data);
  };

  // Watch auto changes
  useEffect(() => {
    const subscription = watch((value) => onSubmit(value));
    return () => subscription.unsubscribe();
  }, [watch, node.id, updateNode]);

  return (
    <form className="flex flex-col gap-4 mt-4" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">Title</label>
        <input {...register('title')} className="px-3 py-2 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
        {errors.title && <span className="text-red-500 text-xs">{errors.title.message as string}</span>}
      </div>

      {node.type === NodeType.TASK && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Assignee</label>
            <input {...register('assignee')} className="px-3 py-2 rounded-md border border-slate-300 text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Due Date</label>
            <input type="date" {...register('dueDate')} className="px-3 py-2 rounded-md border border-slate-300 text-sm" />
          </div>
        </>
      )}

      {node.type === NodeType.APPROVAL && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Approver Role</label>
          <select {...register('approverRole')} className="px-3 py-2 rounded-md border border-slate-300 text-sm">
            <option value="Manager">Manager</option>
            <option value="HRBP">HRBP</option>
            <option value="Director">Director</option>
          </select>
        </div>
      )}

      {node.type === NodeType.AUTOMATED && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Action</label>
          <select {...register('actionId')} className="px-3 py-2 rounded-md border border-slate-300 text-sm">
            <option value="">Select Action...</option>
            {automations.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      )}
    </form>
  );
};

export const NodeFormPanel = () => {
  const { selectedNodeId, nodes, updateNode, setSelectedNode } = useWorkflowStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const [automations, setAutomations] = useState<any[]>([]);

  // Fetch automations if needed
  useEffect(() => {
    if (selectedNode?.type === NodeType.AUTOMATED) {
      fetch('/api/automations').then(r => r.json()).then(setAutomations).catch(console.error);
    }
  }, [selectedNode]);

  // FormElement was moved outside

  if (!selectedNode) return null;

  const registryInfo = nodeRegistry[selectedNode.type as NodeType];

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl p-5 z-20 flex flex-col slide-in-from-right transform transition-transform duration-300">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
           <div className={`p-1.5 rounded-md ${registryInfo.color}`}>
             {/* Using generic icon for panel */}
           </div>
           <h3 className="font-bold text-slate-800">{registryInfo.label} Settings</h3>
        </div>
        <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-slate-100 rounded-md text-slate-500">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <FormElement key={selectedNode.id} node={selectedNode} automations={automations} />
      </div>
    </div>
  );
};
