import React from 'react';
import { nodeRegistry } from '../nodes/nodeRegistry';
import { NodeType } from '../../types/workflow.types';
import { PlayCircle, Clock, CheckCircle2, Zap, StopCircle } from 'lucide-react';

const icons = {
  [NodeType.START]: <PlayCircle className="w-5 h-5 text-green-600" />,
  [NodeType.TASK]: <Clock className="w-5 h-5 text-blue-600" />,
  [NodeType.APPROVAL]: <CheckCircle2 className="w-5 h-5 text-amber-600" />,
  [NodeType.AUTOMATED]: <Zap className="w-5 h-5 text-purple-600" />,
  [NodeType.END]: <StopCircle className="w-5 h-5 text-red-600" />,
};

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col h-full shadow-sm z-10 relative">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">HR Workflow Designer</h2>
        <p className="text-xs text-slate-500 mt-1">Drag nodes to canvas</p>
      </div>

      <div className="flex flex-col gap-3">
        {Object.values(NodeType).map((type) => {
          const info = nodeRegistry[type];
          return (
            <div
              key={type}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-grab hover:shadow-md hover:border-indigo-400 transition-all bg-slate-50"
              draggable
              onDragStart={(e) => onDragStart(e, type)}
            >
              <div className={`p-2 rounded-md ${info.color}`}>
                {icons[type]}
              </div>
              <span className="text-sm font-medium text-slate-700">{info.label}</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-200">
         <p className="text-xs text-center text-slate-400 font-mono">Workflow Prototype</p>
      </div>
    </aside>
  );
};
