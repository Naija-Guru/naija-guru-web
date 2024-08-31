import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './stylesheets/shared.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ width: 300, height: 400 }}>
      <h1>Naija guru popup</h1>
      <button onClick={() => chrome.runtime.openOptionsPage()}>
        Go to options
      </button>
    </div>
  </StrictMode>
);
