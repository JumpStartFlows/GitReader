import React, { useState, useEffect } from 'react';
import { ThemeContext, useThemeState } from './hooks/useTheme';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import { Router } from './components/ui/Router';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { SuccessPage } from './components/payment/SuccessPage';
import { CancelPage } from './components/payment/CancelPage';
import { MainApp } from './components/MainApp';

const AppContent: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router
      routes={[
        { path: '/', component: MainApp },
        { path: '/login', component: LoginPage },
        { path: '/signup', component: SignupPage },
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

export default App;