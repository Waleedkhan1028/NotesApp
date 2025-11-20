import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 500); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      gap={2}
    >
      <Typography variant="h4" color="primary">
        Notes App
      </Typography>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        Redirecting to login...
      </Typography>
    </Box>
  );
}