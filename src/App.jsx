import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './Routes';
import { Toaster } from 'sonner';
import './styles/fonts.css';
import { ThemeProvider } from './components/ui/HeaderNavigation';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        <Toaster richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
