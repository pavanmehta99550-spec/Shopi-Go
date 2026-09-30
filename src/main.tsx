import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global guard for browser extension / MetaMask / sandboxed iframe connection errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (
      reason.includes('MetaMask') ||
      reason.includes('ethereum') ||
      reason.includes('wallet') ||
      reason.includes('Extension context invalidated')
    ) {
      console.warn('[Web3/MetaMask Handled Notice]:', reason);
      event.preventDefault(); // Prevents crash or React error overlay in iframe
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('MetaMask') ||
      msg.includes('ethereum') ||
      msg.includes('Failed to connect to MetaMask')
    ) {
      console.warn('[Handled Extension Error]:', msg);
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
