import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './stylesheets/shared.scss';

const root = document.createElement('div');
root.id = 'crx-root';
document.body.appendChild(root);

createRoot(root).render(
  <StrictMode>
    <h1>Content</h1>
    <>{chrome.runtime.id}</>
  </StrictMode>
);
