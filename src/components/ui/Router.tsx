import React, { useState, useEffect } from 'react';

interface Route {
  path: string;
  component: React.ComponentType<any>;
}

interface RouterProps {
  routes: Route[];
  fallback?: React.ComponentType<any>;
}

export const Router: React.FC<RouterProps> = ({ routes, fallback: Fallback }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Parse query parameters into an object
  const queryParams = Object.fromEntries(searchParams.entries());

  const currentRoute = routes.find(route => route.path === currentPath);
  
  if (currentRoute) {
    const Component = currentRoute.component;
    return <Component queryParams={queryParams} />;
  }

  if (Fallback) {
    return <Fallback queryParams={queryParams} />;
  }

  return <div>404 - Page not found</div>;
};