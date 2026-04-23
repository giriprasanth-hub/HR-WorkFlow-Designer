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
  deleteNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  importWorkflow: (nodes: WorkflowNode[], edges: Edge[]) => void;
  clearCanvas: () => void;
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
      edges: addEdge({ ...connection, type: 'smoothstep' }, get().edges),
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

  deleteNode: (id: string) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  setSelectedNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  importWorkflow: (nodes: WorkflowNode[], edges: Edge[]) => {
    set({ nodes, edges, selectedNodeId: null });
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], selectedNodeId: null });
  },
}));
