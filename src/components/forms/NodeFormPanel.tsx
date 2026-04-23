import React, { useEffect, useState, useCallback } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { nodeRegistry } from '../nodes/nodeRegistry';
import { NodeType } from '../../types/workflow.types';
import { X, Trash2, PlayCircle, Clock, CheckCircle2, Zap, StopCircle } from 'lucide-react';
import { KeyValueEditor } from './KeyValueEditor';
import { DynamicParamsForm } from './DynamicParamsForm';

// Inline icon map for the panel header badge
const NodeIcons: Record<string, React.ReactNode> = {
  [NodeType.START]: <PlayCircle size={14} className="text-emerald-600" />,
  [NodeType.TASK]: <Clock size={14} className="text-blue-600" />,
  [NodeType.APPROVAL]: <CheckCircle2 size={14} className="text-amber-600" />,
  [NodeType.AUTOMATED]: <Zap size={14} className="text-purple-600" />,
  [NodeType.END]: <StopCircle size={14} className="text-red-500" />,
};

// ── Inner form is keyed by node.id so it remounts cleanly on node switch ──
const NodeForm = ({
  node,
  automations,
}: {
  node: any;
  automations: any[];
}) => {
  const { updateNode } = useWorkflowStore();

  // Local controlled state, synced to store on each change
  const [formData, setFormData] = useState<Record<string, any>>(() => ({
    ...node.data,
  }));

  // Persist to store whenever local state changes
  useEffect(() => {
    updateNode(node.id, formData as any);
  }, [formData]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = useCallback(
    (field: string, value: any) =>
      setFormData((prev) => ({ ...prev, [field]: value })),
    []
  );

  const selectedAutomation = automations.find(
    (a) => a.id === formData.actionId
  );

  return (
    <div className="flex flex-col gap-3">
      {/* ── Title (all nodes) ── */}
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={formData.title || ''}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Node title..."
        />
      </div>

      {/* ── START NODE ── */}
      {node.type === NodeType.START && (
        <KeyValueEditor
          label="Metadata"
          pairs={formData.metadata || []}
          onChange={(pairs) => set('metadata', pairs)}
          keyPlaceholder="e.g. trigger"
          valuePlaceholder="e.g. employee_join"
        />
      )}

      {/* ── TASK NODE ── */}
      {node.type === NodeType.TASK && (
        <>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description || ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe what needs to be done..."
              rows={3}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Assignee</label>
            <input
              className="form-input"
              value={formData.assignee || ''}
              onChange={(e) => set('assignee', e.target.value)}
              placeholder="e.g. HR Team, John Doe"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate || ''}
              onChange={(e) => set('dueDate', e.target.value)}
            />
          </div>
          <KeyValueEditor
            label="Custom Fields"
            pairs={formData.customFields || []}
            onChange={(pairs) => set('customFields', pairs)}
            keyPlaceholder="Field name"
            valuePlaceholder="Value"
          />
        </>
      )}

      {/* ── APPROVAL NODE ── */}
      {node.type === NodeType.APPROVAL && (
        <>
          <div className="form-group">
            <label className="form-label">Approver Role</label>
            <select
              className="form-select"
              value={formData.approverRole || 'Manager'}
              onChange={(e) => set('approverRole', e.target.value)}
            >
              <option value="Manager">Manager</option>
              <option value="HRBP">HRBP</option>
              <option value="Director">Director</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Auto-approve Threshold (days)</label>
            <input
              type="number"
              className="form-input"
              value={formData.autoApproveThreshold ?? ''}
              onChange={(e) =>
                set(
                  'autoApproveThreshold',
                  e.target.value === '' ? null : Number(e.target.value)
                )
              }
              placeholder="e.g. 3 — auto-approve after N days"
              min={0}
            />
          </div>
        </>
      )}

      {/* ── AUTOMATED STEP NODE ── */}
      {node.type === NodeType.AUTOMATED && (
        <>
          <div className="form-group">
            <label className="form-label">Action</label>
            <select
              className="form-select"
              value={formData.actionId || ''}
              onChange={(e) => {
                set('actionId', e.target.value);
                set('params', {}); // reset params on action change
              }}
            >
              <option value="">Select action...</option>
              {automations.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {automations.length === 0 && (
              <span className="text-xs text-slate-400 mt-1">
                Loading actions...
              </span>
            )}
          </div>

          {selectedAutomation && (
            <div
              className="rounded-lg p-3 text-xs text-slate-600"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              {selectedAutomation.description}
            </div>
          )}

          {selectedAutomation && (
            <DynamicParamsForm
              paramsConfig={selectedAutomation.paramsConfig}
              values={formData.params || {}}
              onChange={(vals) => set('params', vals)}
            />
          )}
        </>
      )}

      {/* ── END NODE ── */}
      {node.type === NodeType.END && (
        <>
          <div className="form-group">
            <label className="form-label">End Message</label>
            <textarea
              className="form-textarea"
              value={formData.endMessage || ''}
              onChange={(e) => set('endMessage', e.target.value)}
              placeholder="Workflow completion message..."
              rows={3}
            />
          </div>
          <div className="form-group">
            <label
              className="form-toggle"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => set('isSummary', !formData.isSummary)}
            >
              <div className={`toggle-switch ${formData.isSummary ? 'active' : ''}`} />
              <span className="text-xs font-medium text-slate-700">
                Generate Summary Report
              </span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

// ── Outer panel container ──
export const NodeFormPanel = () => {
  const { selectedNodeId, nodes, deleteNode, setSelectedNode } =
    useWorkflowStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const [automations, setAutomations] = useState<any[]>([]);

  // Fetch automations when an Automated node is selected
  useEffect(() => {
    if (selectedNode?.type === NodeType.AUTOMATED) {
      fetch('/api/automations')
        .then((r) => r.json())
        .then(setAutomations)
        .catch(console.error);
    }
  }, [selectedNode?.id, selectedNode?.type]);

  if (!selectedNode) return null;

  const registryInfo = nodeRegistry[selectedNode.type as NodeType];

  return (
    <div
      className="absolute top-0 right-0 h-full z-20 animate-slide-in-right"
      style={{ width: 300 }}
    >
      <div className="form-panel h-full" style={{ boxShadow: 'var(--shadow-panel)', borderLeft: '1px solid var(--panel-border)' }}>
        {/* Header */}
        <div className="form-panel__header">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 28,
                height: 28,
                background: registryInfo.color.replace('bg-', 'var(--tw-bg-opacity, 1); background-color: '),
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background:
                    selectedNode.type === NodeType.START
                      ? '#dcfce7'
                      : selectedNode.type === NodeType.TASK
                      ? '#dbeafe'
                      : selectedNode.type === NodeType.APPROVAL
                      ? '#fef3c7'
                      : selectedNode.type === NodeType.AUTOMATED
                      ? '#ede9fe'
                      : '#fee2e2',
                }}
              >
                {NodeIcons[selectedNode.type as string]}
              </span>
            </div>
            <div>
              <div className="form-panel__title">{registryInfo.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                ID: {selectedNode.id.slice(0, 8)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="icon-btn"
              style={{ color: 'var(--danger)' }}
              title="Delete node"
              onClick={() => deleteNode(selectedNode.id)}
            >
              <Trash2 size={14} />
            </button>
            <button
              className="icon-btn"
              title="Close panel"
              onClick={() => setSelectedNode(null)}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Form body */}
        <div className="form-panel__body">
          <NodeForm
            key={selectedNode.id}
            node={selectedNode}
            automations={automations}
          />
        </div>
      </div>
    </div>
  );
};
