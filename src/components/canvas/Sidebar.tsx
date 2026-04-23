import React, { useRef } from 'react';
import { nodeRegistry } from '../nodes/nodeRegistry';
import { NodeType } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import {
  PlayCircle,
  Clock,
  CheckCircle2,
  Zap,
  StopCircle,
  Download,
  Upload,
  Trash2,
  GitBranch,
} from 'lucide-react';

const nodeIcons: Record<string, React.ReactNode> = {
  [NodeType.START]: <PlayCircle size={14} color="#10b981" />,
  [NodeType.TASK]: <Clock size={14} color="#3b82f6" />,
  [NodeType.APPROVAL]: <CheckCircle2 size={14} color="#f59e0b" />,
  [NodeType.AUTOMATED]: <Zap size={14} color="#8b5cf6" />,
  [NodeType.END]: <StopCircle size={14} color="#ef4444" />,
};

const nodeIconBgs: Record<string, string> = {
  [NodeType.START]: 'rgba(16,185,129,0.15)',
  [NodeType.TASK]: 'rgba(59,130,246,0.15)',
  [NodeType.APPROVAL]: 'rgba(245,158,11,0.15)',
  [NodeType.AUTOMATED]: 'rgba(139,92,246,0.15)',
  [NodeType.END]: 'rgba(239,68,68,0.15)',
};

const nodeDescriptions: Record<string, string> = {
  [NodeType.START]: 'Workflow entry point',
  [NodeType.TASK]: 'Manual human task',
  [NodeType.APPROVAL]: 'Manager/HR approval',
  [NodeType.AUTOMATED]: 'System-triggered action',
  [NodeType.END]: 'Workflow completion',
};

export const Sidebar = () => {
  const { nodes, edges, importWorkflow, clearCanvas } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleExport = () => {
    const payload = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr-workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.nodes && parsed.edges) {
          importWorkflow(parsed.nodes, parsed.edges);
        } else {
          alert('Invalid workflow JSON: missing nodes or edges.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    // reset so same file can be re-imported
    event.target.value = '';
  };

  const handleClear = () => {
    if (nodes.length === 0) return;
    if (confirm('Clear the canvas? This cannot be undone.')) {
      clearCanvas();
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo / Brand */}
      <div className="sidebar__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GitBranch size={16} color="white" />
          </div>
          <div>
            <div className="sidebar__logo-text">HR Flow</div>
            <div className="sidebar__subtitle">Workflow Designer</div>
          </div>
        </div>
      </div>

      {/* Node palette */}
      <div className="sidebar__section-label">Node Palette</div>
      <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.values(NodeType).map((type) => {
          const info = nodeRegistry[type];
          return (
            <div
              key={type}
              className="sidebar__node-item"
              style={{ borderRadius: 8 }}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              title={`Drag to add ${info.label}`}
            >
              <div
                className="sidebar__node-item__icon"
                style={{ background: nodeIconBgs[type] }}
              >
                {nodeIcons[type]}
              </div>
              <div>
                <div className="sidebar__node-item__label">{info.label}</div>
                <div className="sidebar__node-item__desc">{nodeDescriptions[type]}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="sidebar__divider" style={{ margin: '12px 0' }} />

      {/* Actions */}
      <div className="sidebar__section-label">Actions</div>
      <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button className="sidebar__action-btn" style={{ borderRadius: 8 }} onClick={handleExport}>
          <Download size={13} />
          Export JSON
        </button>
        <button
          className="sidebar__action-btn"
          style={{ borderRadius: 8 }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={13} />
          Import JSON
        </button>
        <button
          className="sidebar__action-btn"
          style={{ borderRadius: 8, color: '#ef4444' }}
          onClick={handleClear}
        >
          <Trash2 size={13} />
          Clear Canvas
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>

      {/* Footer */}
      <div className="sidebar__footer">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 11, color: '#475569' }}>
            {nodes.length} node{nodes.length !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: 11, color: '#475569' }}>
            {edges.length} edge{edges.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            color: '#334155',
            textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Tredence Analytics · v1.0
        </div>
      </div>
    </aside>
  );
};
