"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Box, Paper, Typography, Link,  } from "@mui/material";
import { useRouter } from "next/router";

import NextLink from "next/link";
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useLogin } from "../../api/ApiHooks/login/index";
import RHFTextField from "../_core/components/form/RHFTextField";
import RHFButton from "../_core/components/button/RHFButton";
import { loginSchema, LoginFormData } from "../../lib/schemas";
import { useSnackbar } from "../../context/SnackbarContext";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { isAuthenticated, login } = useAuth();
  const { showSnackbar } = useSnackbar(); 

  const redirectTo = router.query.from 
    ? decodeURIComponent(router.query.from as string) 
    : '/notes'; 

 
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

 
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
    mode: "onChange", 
  });




  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
       
        showSnackbar(response.message || "Login successful!", "success");
      
        if (response.user) {
          login(response.user);
        }
        
     
      },
      onError: (error:any) => {
       showSnackbar(error?.response?.data?.message || "Login failed!", "error");
      },
    });
  };


  if (isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <Paper sx={{ p: 4, width: 420, textAlign: 'center' }}>
          <Typography variant="h5" mb={2}>✅ Already Logged In</Typography>
          <Typography variant="body1" mb={3}>
            Redirecting you to your notes...
          </Typography>
          
        </Paper>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" backgroundColor="#64b5f6" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: 420 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField
            name="identifier"
            control={control}
            label="Username or Email"
          
          />
          <Box mt={2} />
          <RHFTextField
            name="password"
            control={control}
            label="Password"
            type="password"
         
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <RHFButton 
              type="submit" 
              label={loginMutation.isPending ? "Logging in..." : "Login"} 
              disabled={loginMutation.isPending || !isValid}
            />
          </Box>
        </form>
        
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link 
              component={NextLink} 
              href="/signup" 
              underline="hover"
              sx={{ 
                cursor: 'pointer',
                fontWeight: 'medium'
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
      
    </Box>
  );
}