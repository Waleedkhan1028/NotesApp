import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      
      const currentPath = router.asPath;
      router.push(`/login?from=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        <div>Checking authentication...</div>
      </div>
    );
  }

 
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        <div>Redirecting to login page...</div>
      </div>
    );
  }


  return <>{children}</>;
};

export default RequireAuth;