import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove the default css imports that Vite adds on create-vite
async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }
 
  const { worker } = await import('./api/browser');
 
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
