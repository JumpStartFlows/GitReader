import React from 'react';
import { ThemeContext, useThemeState } from './hooks/useTheme';
import { Router } from './components/ui/Router';
import { SuccessPage } from './components/payment/SuccessPage';
import { CancelPage } from './components/payment/CancelPage';
import { MainApp } from './components/MainApp';

const AppContent: React.FC = () => {
  return (
    <Router
      routes={[
        { path: '/', component: MainApp },
        { path: '/success', component: SuccessPage },
        { path: '/cancel', component: CancelPage },
      ]}
      fallback={MainApp}
    />
  );
};

function App() {
  const themeState = useThemeState();

  return (
    <ThemeContext.Provider value={themeState}>
      <AppContent />
    </ThemeContext.Provider>
  );
}

export default App;