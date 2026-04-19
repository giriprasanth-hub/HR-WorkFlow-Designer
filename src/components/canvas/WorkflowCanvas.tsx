import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { nodeRegistry } from '../nodes/nodeRegistry';
import { Sidebar } from './Sidebar';
import { NodeFormPanel } from '../forms/NodeFormPanel';
import { SandboxPanel } from '../sandbox/TestPanel';
import { v4 as uuidv4 } from 'uuid';
import { NodeType } from '../../types/workflow.types';

export const WorkflowCanvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setSelectedNode } = useWorkflowStore();

  const nodeTypes = useMemo(() => {
    const types: Record<string, React.FC<any>> = {};
    Object.values(NodeType).forEach(type => {
      // We will define this map securely later
      types[type] = nodeRegistry[type].component;
    });
    return types;
  }, []);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    
    // React Flow hook for bounds not easily accessible here without useReactFlow, 
    // so using roughly mouse x/y locally. 
    // Usually you wrap this component in ReactFlowProvider.
    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow') as NodeType;

    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = reactFlowBounds ? {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    } : { x: 0, y: 0 };

    const registryEntry = nodeRegistry[type];

    const newNode = {
      id: uuidv4(),
      type,
      position,
      data: { 
        ...registryEntry.defaultData,
        title: `${registryEntry.label} Node`
      },
    };

    addNode(newNode);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 relative overflow-hidden">
      {/* Sidebar on left */}
      <Sidebar />
      
      {/* Canvas in Middle */}
      <div className="flex-1 h-full" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onPaneClick={() => setSelectedNode(null)}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          fitView
        >
          <Background color="#ccc" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Slide Over panels overlay layer */}
      <SandboxPanel />
      <NodeFormPanel />
    </div>
  );
};
