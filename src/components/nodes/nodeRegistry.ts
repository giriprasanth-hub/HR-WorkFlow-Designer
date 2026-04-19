import { StartNode, TaskNode, ApprovalNode, AutomatedStepNode, EndNode } from './Nodes';
import { NodeType } from '../../types/workflow.types';
import { startNodeSchema, taskNodeSchema, approvalNodeSchema, automatedNodeSchema, endNodeSchema } from '../forms/schemas';

export const nodeRegistry = {
  [NodeType.START]: { 
    component: StartNode, 
    label: 'Start Event', 
    color: 'bg-green-100', 
    defaultData: { type: NodeType.START, metadata: [] }, 
    schema: startNodeSchema 
  },
  [NodeType.TASK]: { 
    component: TaskNode, 
    label: 'Manual Task', 
    color: 'bg-blue-100', 
    defaultData: { type: NodeType.TASK, description: '', assignee: '', dueDate: '', customFields: [] }, 
    schema: taskNodeSchema 
  },
  [NodeType.APPROVAL]: { 
    component: ApprovalNode, 
    label: 'Approval', 
    color: 'bg-amber-100', 
    defaultData: { type: NodeType.APPROVAL, approverRole: 'Manager' }, 
    schema: approvalNodeSchema 
  },
  [NodeType.AUTOMATED]: { 
    component: AutomatedStepNode, 
    label: 'Automated Step', 
    color: 'bg-purple-100', 
    defaultData: { type: NodeType.AUTOMATED, actionId: '', params: {} }, 
    schema: automatedNodeSchema 
  },
  [NodeType.END]: { 
    component: EndNode, 
    label: 'End Event', 
    color: 'bg-red-100', 
    defaultData: { type: NodeType.END, endMessage: '', isSummary: false }, 
    schema: endNodeSchema 
  },
};
