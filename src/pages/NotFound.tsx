import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-2 text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="mb-6 text-xs font-mono text-muted-foreground opacity-50">Path: {location.pathname}</p>
        <a href="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-all">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
