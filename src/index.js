import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import ModalState from './context/modalState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider i18n={enTranslations}>
      <ModalState>
        <App />
      </ModalState>
    </AppProvider>
  </React.StrictMode>
);
