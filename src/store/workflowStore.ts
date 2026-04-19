import { create } from 'zustand';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from 'reactflow';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type { ExtendedNodeData } from '../types/workflow.types';

export type WorkflowNode = Node<ExtendedNodeData>;

export type WorkflowState = {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, data: Partial<ExtendedNodeData>) => void;
  setSelectedNode: (id: string | null) => void;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (node: WorkflowNode) => {
    set({ nodes: [...get().nodes, node] });
  },

  updateNode: (id: string, data: Partial<ExtendedNodeData>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } } as WorkflowNode;
        }
        return node;
      }) as WorkflowNode[],
    });
  },

  setSelectedNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },
}));
