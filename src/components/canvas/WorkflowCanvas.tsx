import React, { useMemo, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { nodeRegistry } from '../nodes/nodeRegistry';
import { Sidebar } from './Sidebar';
import { NodeFormPanel } from '../forms/NodeFormPanel';
import { SandboxPanel } from '../sandbox/TestPanel';
import { v4 as uuidv4 } from 'uuid';
import { NodeType } from '../../types/workflow.types';

// ── Inner canvas — needs to be inside ReactFlowProvider to use useReactFlow ──
const CanvasInner = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    setSelectedNode,
    selectedNodeId,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow();

  // Build nodeTypes map — memoised per registry shape (stable)
  const nodeTypes = useMemo(() => {
    const types: Record<string, React.FC<any>> = {};
    Object.values(NodeType).forEach((type) => {
      types[type] = nodeRegistry[type].component;
    });
    return types;
  }, []);

  // Keyboard: Delete selected node
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedNodeId &&
        // Make sure we're not in an input / textarea
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLSelectElement)
      ) {
        deleteNode(selectedNodeId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, deleteNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type || !nodeRegistry[type]) return;

      // Use the ReactFlow hook for accurate position conversion
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const registryEntry = nodeRegistry[type];
      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: {
          ...registryEntry.defaultData,
          title: registryEntry.label,
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const proOptions = { hideAttribution: true };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--canvas-bg)' }}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Canvas */}
      <div className="flex-1 h-full relative" onDragOver={onDragOver} onDrop={onDrop}>
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
          fitViewOptions={{ padding: 0.2 }}
          proOptions={proOptions}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#6366f1', strokeWidth: 2 },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#cbd5e1"
          />
          <Controls
            style={{ bottom: 24, left: 16, top: 'unset' }}
            showInteractive={false}
          />
          <MiniMap
            style={{
              bottom: 24,
              left: 120,
              top: 'unset',
              borderRadius: 12,
              border: '1px solid var(--panel-border)',
            }}
            nodeColor={(n) => {
              const colors: Record<string, string> = {
                [NodeType.START]: '#10b981',
                [NodeType.TASK]: '#3b82f6',
                [NodeType.APPROVAL]: '#f59e0b',
                [NodeType.AUTOMATED]: '#8b5cf6',
                [NodeType.END]: '#ef4444',
              };
              return colors[n.type as string] || '#94a3b8';
            }}
            maskColor="rgba(248,250,252,0.7)"
          />
        </ReactFlow>

        {/* Empty state hint */}
        {nodes.length === 0 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 12,
                opacity: 0.15,
              }}
            >
              ⟳
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8' }}>
              Drop nodes here to start
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>
              Drag from the left panel to build your workflow
            </div>
          </div>
        )}

        {/* Overlay panels */}
        <SandboxPanel />
      </div>

      {/* Right form panel */}
      <NodeFormPanel />
    </div>
  );
};

export const WorkflowCanvas = () => <CanvasInner />;
