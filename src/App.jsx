import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './Routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster richColors />
    </AuthProvider>
  );
}

export default App;
