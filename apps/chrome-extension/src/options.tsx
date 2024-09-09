import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './stylesheets/shared.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1 className="text-3xl font-bold underline">Naija guru options</h1>
  </StrictMode>
);
