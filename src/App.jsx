import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import AppRouter from './Routes';
import { Toaster } from 'sonner';
import './styles/fonts.css';
import { ThemeProvider } from './components/ui/HeaderNavigation';
import { StagewiseToolbar } from '@stagewise/toolbar-react';

function App() {
  const isStagewiseEnabled = import.meta.env.VITE_STAGEWISE_MODE === 'development';

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <AppRouter />
          {isStagewiseEnabled && (
            <StagewiseToolbar 
              config={{
                plugins: [],
              }}
            />
          )}
        </ProjectProvider>
        <Toaster richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
