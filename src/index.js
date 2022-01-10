import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from './components/themeContext';
import Routes from './routes';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);