import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/Auth/AuthContext';
import { SocketProvider } from './contexts/Socket/SocketContext';
import 'modern-normalize/modern-normalize.css';
import './var.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <Router>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </Router>,
);
