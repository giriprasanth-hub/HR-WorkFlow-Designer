import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { ExtendedNodeData } from '../../types/workflow.types';
import { NodeType } from '../../types/workflow.types';
import {
  PlayCircle,
  Clock,
  CheckCircle2,
  Zap,
  StopCircle,
  AlertCircle,
  User,
  Calendar,
  Shield,
  Terminal,
  FileText,
} from 'lucide-react';

// ── Color / style configs per node type ──
const nodeThemes: Record<
  string,
  {
    headerBg: string;
    headerText: string;
    iconBg: string;
    icon: React.ReactNode;
    badge: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  [NodeType.START]: {
    headerBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    headerText: '#ffffff',
    iconBg: 'rgba(255,255,255,0.2)',
    icon: <PlayCircle size={16} color="white" />,
    badge: 'START',
    badgeBg: 'rgba(255,255,255,0.25)',
    badgeText: 'white',
  },
  [NodeType.TASK]: {
    headerBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    headerText: '#ffffff',
    iconBg: 'rgba(255,255,255,0.2)',
    icon: <Clock size={16} color="white" />,
    badge: 'TASK',
    badgeBg: 'rgba(255,255,255,0.25)',
    badgeText: 'white',
  },
  [NodeType.APPROVAL]: {
    headerBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    headerText: '#ffffff',
    iconBg: 'rgba(255,255,255,0.2)',
    icon: <CheckCircle2 size={16} color="white" />,
    badge: 'APPROVAL',
    badgeBg: 'rgba(255,255,255,0.25)',
    badgeText: 'white',
  },
  [NodeType.AUTOMATED]: {
    headerBg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    headerText: '#ffffff',
    iconBg: 'rgba(255,255,255,0.2)',
    icon: <Zap size={16} color="white" />,
    badge: 'AUTO',
    badgeBg: 'rgba(255,255,255,0.25)',
    badgeText: 'white',
  },
  [NodeType.END]: {
    headerBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    headerText: '#ffffff',
    iconBg: 'rgba(255,255,255,0.2)',
    icon: <StopCircle size={16} color="white" />,
    badge: 'END',
    badgeBg: 'rgba(255,255,255,0.25)',
    badgeText: 'white',
  },
};

// ── Metadata row inside node body ──
const MetaRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) =>
  value ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        color: '#64748b',
      }}
    >
      <span style={{ color: '#94a3b8', flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          fontWeight: 500,
          color: '#94a3b8',
          minWidth: 48,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: '#1e293b',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 110,
        }}
      >
        {value}
      </span>
    </div>
  ) : null;

// ── Base visual node ──
const BaseNode = ({
  data,
  selected,
  hasError,
}: {
  data: ExtendedNodeData;
  selected?: boolean;
  hasError?: boolean;
}) => {
  const theme = nodeThemes[data.type] || nodeThemes[NodeType.TASK];

  return (
    <div
      className="workflow-node"
      style={{
        minWidth: 210,
        maxWidth: 220,
        border: selected
          ? '2px solid #6366f1'
          : hasError
          ? '2px solid #ef4444'
          : '1.5px solid #e2e8f0',
        position: 'relative',
      }}
    >
      {/* Validation error dot */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid white',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertCircle size={8} color="white" />
        </div>
      )}

      {/* Header */}
      <div
        style={{
          background: theme.headerBg,
          borderRadius: '10px 10px 0 0',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: theme.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {theme.icon}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.headerText,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.title || data.type}
          </div>
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            background: theme.badgeBg,
            color: theme.badgeText,
            padding: '2px 6px',
            borderRadius: 999,
            flexShrink: 0,
          }}
        >
          {theme.badge}
        </span>
      </div>

      {/* Body — context-sensitive summary */}
      <div
        style={{
          padding: '8px 12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          background: 'white',
          borderRadius: '0 0 10px 10px',
        }}
      >
        {data.type === NodeType.START && (
          <MetaRow
            icon={<FileText size={10} />}
            label="Meta"
            value={
              (data as any).metadata?.length
                ? `${(data as any).metadata.length} key(s)`
                : 'No metadata'
            }
          />
        )}
        {data.type === NodeType.TASK && (
          <>
            <MetaRow
              icon={<User size={10} />}
              label="Assignee"
              value={(data as any).assignee || 'Unassigned'}
            />
            <MetaRow
              icon={<Calendar size={10} />}
              label="Due"
              value={(data as any).dueDate || 'No date'}
            />
          </>
        )}
        {data.type === NodeType.APPROVAL && (
          <MetaRow
            icon={<Shield size={10} />}
            label="Role"
            value={(data as any).approverRole || 'Manager'}
          />
        )}
        {data.type === NodeType.AUTOMATED && (
          <MetaRow
            icon={<Terminal size={10} />}
            label="Action"
            value={(data as any).actionId || 'None selected'}
          />
        )}
        {data.type === NodeType.END && (
          <MetaRow
            icon={<FileText size={10} />}
            label="Message"
            value={(data as any).endMessage || 'Workflow complete'}
          />
        )}
      </div>
    </div>
  );
};

// ── Individual exported node components ──
export const StartNode = ({ data, selected }: NodeProps<ExtendedNodeData>) => (
  <div>
    <BaseNode data={data} selected={selected} />
    <Handle
      type="source"
      position={Position.Right}
      style={{ background: '#10b981', border: '2px solid white', width: 10, height: 10 }}
    />
  </div>
);

export const TaskNode = ({ data, selected }: NodeProps<ExtendedNodeData>) => (
  <div>
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: '#3b82f6', border: '2px solid white', width: 10, height: 10 }}
    />
    <BaseNode data={data} selected={selected} />
    <Handle
      type="source"
      position={Position.Right}
      style={{ background: '#3b82f6', border: '2px solid white', width: 10, height: 10 }}
    />
  </div>
);

export const ApprovalNode = ({ data, selected }: NodeProps<ExtendedNodeData>) => (
  <div>
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: '#f59e0b', border: '2px solid white', width: 10, height: 10 }}
    />
    <BaseNode data={data} selected={selected} />
    <Handle
      type="source"
      position={Position.Right}
      style={{ background: '#f59e0b', border: '2px solid white', width: 10, height: 10 }}
    />
  </div>
);

export const AutomatedStepNode = ({ data, selected }: NodeProps<ExtendedNodeData>) => (
  <div>
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: '#8b5cf6', border: '2px solid white', width: 10, height: 10 }}
    />
    <BaseNode data={data} selected={selected} />
    <Handle
      type="source"
      position={Position.Right}
      style={{ background: '#8b5cf6', border: '2px solid white', width: 10, height: 10 }}
    />
  </div>
);

export const EndNode = ({ data, selected }: NodeProps<ExtendedNodeData>) => (
  <div>
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: '#ef4444', border: '2px solid white', width: 10, height: 10 }}
    />
    <BaseNode data={data} selected={selected} />
  </div>
);
