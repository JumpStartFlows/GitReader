import React, { useState, useEffect } from 'react';

interface Route {
  path: string;
  component: React.ComponentType;
}

interface RouterProps {
  routes: Route[];
  fallback?: React.ComponentType;
}

export const Router: React.FC<RouterProps> = ({ routes, fallback: Fallback }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const currentRoute = routes.find(route => route.path === currentPath);
  
  if (currentRoute) {
    const Component = currentRoute.component;
    return <Component />;
  }

  if (Fallback) {
    return <Fallback />;
  }

  return <div>404 - Page not found</div>;
};