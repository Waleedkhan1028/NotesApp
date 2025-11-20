"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { Box, Paper, Typography, Link } from "@mui/material";
import NextLink from "next/link";
import { yupResolver } from '@hookform/resolvers/yup';
import { useSignup } from "../../api/ApiHooks/signup/index";
import RHFTextField from "../_core/components/form/RHFTextField";
import RHFButton from "../_core/components/button/RHFButton";
import { signupSchema, SignupFormData } from "../../lib/schemas";
import { useSnackbar } from "../../context/SnackbarContext";
export default function SignupPage() {
  const router = useRouter();
    const { showSnackbar } = useSnackbar(); 

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: { 
      username: "", 
      email: "", 
      password: "" 
    },
    mode: "onChange", 
  });

 
  const signupMutation = useSignup();

  const onSubmit: SubmitHandler<SignupFormData> = (data) => {

    signupMutation.mutate(data, {
      onSuccess: (response) => {
         
        showSnackbar(response.message || "Signup successful!", "success");
        router.push("/login");
      },
      onError: (error:any) => {
           showSnackbar(error?.response?.data?.message || "Signup failed!", "error");
      },
    });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" backgroundColor="#64b5f6" minHeight="100vh">
      <Paper sx={{ p: 4, width: 420 }}>
        <Typography variant="h5" mb={2}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField 
            name="username" 
            control={control} 
            label="Username" 
           
          />
          <Box mt={2} />
          <RHFTextField 
            name="email" 
            control={control} 
            label="Email" 
            type="email"
    
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
              label={signupMutation.isPending ? "Creating account..." : "Create Account"}
              disabled={signupMutation.isPending || !isValid}
            />
          </Box>
        </form>
        
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link 
              component={NextLink} 
              href="/login" 
              underline="hover"
              sx={{ 
                cursor: 'pointer',
                fontWeight: 'medium'
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}