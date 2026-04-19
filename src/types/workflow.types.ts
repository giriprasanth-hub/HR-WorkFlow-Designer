// Node Types
export const NodeType = {
  START: 'StartNode',
  TASK: 'TaskNode',
  APPROVAL: 'ApprovalNode',
  AUTOMATED: 'AutomatedStepNode',
  END: 'EndNode',
} as const;

export type NodeType = typeof NodeType[keyof typeof NodeType];

// Base Node Data
export interface BaseNodeData {
  title: string;
  type: NodeType;
  [key: string]: any;
}

// Start Node Data
export interface StartNodeData extends BaseNodeData {
  type: 'StartNode';
  metadata: Array<{ key: string; value: string }>;
}

// Task Node Data
export interface TaskNodeData extends BaseNodeData {
  type: 'TaskNode';
  description: string;
  assignee: string;
  dueDate: string;
  customFields?: Array<{ key: string; value: string }>;
}

// Approval Node Data
export interface ApprovalNodeData extends BaseNodeData {
  type: 'ApprovalNode';
  approverRole: string; // 'Manager' | 'HRBP' | 'Director'
  autoApproveThreshold?: number;
}

// Automated Step Node Data
export interface AutomatedStepNodeData extends BaseNodeData {
  type: 'AutomatedStepNode';
  actionId: string;
  params: Record<string, any>;
}

// End Node Data
export interface EndNodeData extends BaseNodeData {
  type: 'EndNode';
  endMessage: string;
  isSummary: boolean;
}

// Union Type for Extended Node Data
export type ExtendedNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

export interface WorkflowGraph {
  nodes: ExtendedNodeData[];
  edges: { source: string; target: string }[];
}
