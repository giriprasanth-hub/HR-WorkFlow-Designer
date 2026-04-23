import React, { useState } from 'react';
import { Play, X, AlertTriangle, CheckCircle, Terminal, Clock, RotateCcw } from 'lucide-react';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { useSimulate } from '../../hooks/useSimulate';
import { useWorkflowStore } from '../../store/workflowStore';

const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    SUCCESS: '#10b981',
    FAILED: '#ef4444',
    PENDING: '#f59e0b',
    SKIPPED: '#94a3b8',
  };
  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: colors[status] || '#94a3b8',
        flexShrink: 0,
      }}
    />
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; color: string }> = {
    SUCCESS: { bg: '#dcfce7', color: '#166534' },
    FAILED: { bg: '#fee2e2', color: '#991b1b' },
    PENDING: { bg: '#fef3c7', color: '#92400e' },
    SKIPPED: { bg: '#f1f5f9', color: '#64748b' },
  };
  const c = config[status] || config.SKIPPED;
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.05em',
        background: c.bg,
        color: c.color,
        padding: '1px 6px',
        borderRadius: 999,
        textTransform: 'uppercase' as const,
      }}
    >
      {status}
    </span>
  );
};

export const SandboxPanel = () => {
  const { nodes } = useWorkflowStore();
  const [isOpen, setIsOpen] = useState(false);
  const { errors, hasErrors } = useWorkflowValidation();
  const { logs, isLoading, hasRun, runSimulation, reset } = useSimulate();

  const handleRun = async () => {
    setIsOpen(true);
    reset();
    await runSimulation();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const canRun = nodes.length > 0 && !isLoading;

  return (
    <>
      {/* Floating run button */}
      <button
        className="run-btn"
        onClick={handleRun}
        disabled={!canRun}
        title={nodes.length === 0 ? 'Add nodes first' : 'Run workflow simulation'}
      >
        {isLoading ? (
          <span className="loading-spinner" style={{ width: 14, height: 14 }} />
        ) : (
          <Play size={14} fill="currentColor" />
        )}
        <span>{isLoading ? 'Running...' : 'Test Workflow'}</span>
      </button>

      {/* Execution log panel */}
      {isOpen && (
        <div className="sandbox-panel">
          {/* Header */}
          <div className="sandbox-panel__header">
            <div className="sandbox-panel__title">
              <Terminal size={14} />
              Execution Log
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {hasRun && !isLoading && (
                <button
                  onClick={handleRun}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 8px',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 11,
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <RotateCcw size={10} />
                  Re-run
                </button>
              )}
              <button className="icon-btn icon-btn-dark" onClick={handleClose}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="sandbox-panel__body">
            {/* Validation warnings shown before execution */}
            {errors.length > 0 && (
              <div style={{ marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {errors.map((err, i) => (
                  <div
                    key={i}
                    className={err.severity === 'error' ? 'validation-badge' : 'validation-badge'}
                    style={{
                      background: err.severity === 'error' ? '#fee2e2' : '#fef9c3',
                      color: err.severity === 'error' ? '#991b1b' : '#713f12',
                      borderRadius: 8,
                      padding: '7px 10px',
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 6,
                    }}
                  >
                    <AlertTriangle size={11} style={{ marginTop: 1, flexShrink: 0 }} />
                    {err.message}
                  </div>
                ))}
              </div>
            )}

            {/* Loading spinner row */}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 0',
                  color: '#64748b',
                  fontSize: 13,
                }}
              >
                <span className="loading-spinner" />
                Simulating workflow...
              </div>
            )}

            {/* Empty state */}
            {!isLoading && hasRun && logs.length === 0 && (
              <div
                style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: 13 }}
              >
                No execution steps generated.
              </div>
            )}

            {/* Execution steps */}
            {logs.map((item, i) => (
              <div
                key={i}
                className="execution-step animate-step-in"
                style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
              >
                <div className="execution-step__indicator">
                  <StatusDot status={item.status} />
                  {i !== logs.length - 1 && (
                    <div className="execution-step__connector" />
                  )}
                </div>
                <div className="execution-step__content">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}
                  >
                    <span className="execution-step__title">{item.title}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="execution-step__log">{item.log}</div>
                </div>
              </div>
            ))}

            {/* Success summary */}
            {!isLoading && hasRun && logs.length > 0 && logs.every((l) => l.status === 'SUCCESS') && (
              <div
                className="success-badge"
                style={{ marginTop: 8 }}
              >
                <CheckCircle size={13} />
                All {logs.length} steps completed successfully.
              </div>
            )}
          </div>

          {/* Footer stats */}
          {!isLoading && hasRun && logs.length > 0 && (
            <div
              style={{
                padding: '8px 14px',
                borderTop: '1px solid var(--panel-border)',
                display: 'flex',
                gap: 12,
                fontSize: 11,
                color: '#94a3b8',
                flexShrink: 0,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={10} />
                {logs.length} steps
              </span>
              <span style={{ color: '#10b981' }}>
                ✓ {logs.filter((l) => l.status === 'SUCCESS').length} passed
              </span>
              {logs.some((l) => l.status === 'FAILED') && (
                <span style={{ color: '#ef4444' }}>
                  ✗ {logs.filter((l) => l.status === 'FAILED').length} failed
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
