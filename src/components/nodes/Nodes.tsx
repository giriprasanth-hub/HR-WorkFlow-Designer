import React from 'react';
import { Handle, Position } from 'reactflow';
import type { ExtendedNodeData } from '../../types/workflow.types';
import { NodeType } from '../../types/workflow.types';
import { PlayCircle, Clock, CheckCircle2, Zap, StopCircle } from 'lucide-react';

const icons = {
  [NodeType.START]: <PlayCircle className="w-5 h-5 text-green-600" />,
  [NodeType.TASK]: <Clock className="w-5 h-5 text-blue-600" />,
  [NodeType.APPROVAL]: <CheckCircle2 className="w-5 h-5 text-amber-600" />,
  [NodeType.AUTOMATED]: <Zap className="w-5 h-5 text-purple-600" />,
  [NodeType.END]: <StopCircle className="w-5 h-5 text-red-600" />,
};

const nodeColors = {
  [NodeType.START]: 'bg-green-100',
  [NodeType.TASK]: 'bg-blue-100',
  [NodeType.APPROVAL]: 'bg-amber-100',
  [NodeType.AUTOMATED]: 'bg-purple-100',
  [NodeType.END]: 'bg-red-100',
};

const BaseNode = ({ data, selected }: { data: ExtendedNodeData, selected?: boolean }) => {
  
  return (
    <div className={`p-4 rounded-lg shadow-md border-2 w-55 bg-white transition-all
      ${selected ? 'border-indigo-500 shadow-indigo-200' : 'border-slate-200'}
    `}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-md ${nodeColors[data.type]}`}>
          {icons[data.type]}
        </div>
        <div className="font-semibold text-sm text-slate-800">{data.title}</div>
      </div>
      
      {/* Node specific summary */}
      <div className="text-xs text-slate-500 truncate">
        {data.type === NodeType.TASK ? `Assignee: ${data.assignee || 'Unassigned'}` : ''}
        {data.type === NodeType.APPROVAL ? `Role: ${data.approverRole}` : ''}
      </div>
    </div>
  );
};

export const StartNode = ({ data, selected }: { data: ExtendedNodeData, selected?: boolean }) => (
  <div>
    <BaseNode data={data} selected={selected} />
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-500" />
  </div>
);

export const TaskNode = ({ data, selected }: { data: ExtendedNodeData, selected?: boolean }) => (
  <div>
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-indigo-500" />
    <BaseNode data={data} selected={selected} />
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-500" />
  </div>
);

export const ApprovalNode = ({ data, selected }: { data: ExtendedNodeData, selected?: boolean }) => (
  <div>
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-indigo-500" />
    <BaseNode data={data} selected={selected} />
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-500" />
  </div>
);

export const AutomatedStepNode = ({ data, selected }: { data: ExtendedNodeData, selected?: boolean }) => (
  <div>
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-indigo-500" />
    <BaseNode data={data} selected={selected} />
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-500" />
  </div>
);

export const EndNode = ({ data, selected }: { data: ExtendedNodeData, selected?: boolean }) => (
  <div>
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-indigo-500" />
    <BaseNode data={data} selected={selected} />
  </div>
);
