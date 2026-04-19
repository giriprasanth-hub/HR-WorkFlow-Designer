import React from 'react';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  );
}

export default App;
