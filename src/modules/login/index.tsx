"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Box, Paper, Typography, Link } from "@mui/material";
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

  const { control, handleSubmit, formState: { isValid } } = useForm<LoginFormData>({
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
      onError: (error: any) => {
        showSnackbar(error?.response?.data?.message || "Login failed!", "error");
      },
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2a1a3a 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 440,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        className="animate-slide-in"
      >
        <Typography
          variant="h4"
          mb={1}
          sx={{
            background: 'linear-gradient(135deg, #90caf9 0%, #f48fb1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Sign in to continue to your notes
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField
            name="identifier"
            control={control}
            label="Username or Email"
          />
          <Box mt={3} />
          <RHFTextField
            name="password"
            control={control}
            label="Password"
            type="password"
          />
          <Box mt={4} display="flex" justifyContent="flex-end">
            <RHFButton
              type="submit"
              label={loginMutation.isPending ? "Signing in..." : "Sign In"}
              disabled={loginMutation.isPending || !isValid}
            />
          </Box>
        </form>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link
              component={NextLink}
              href="/signup"
              underline="hover"
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                color: 'primary.main',
                transition: 'color 0.3s',
                '&:hover': {
                  color: 'primary.light',
                },
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