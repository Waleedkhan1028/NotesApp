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

  const { control, handleSubmit, formState: { isValid } } = useForm<SignupFormData>({
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
      onError: (error: any) => {
        showSnackbar(error?.response?.data?.message || "Signup failed!", "error");
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
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Join us to start organizing your notes
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField
            name="username"
            control={control}
            label="Username"
          />
          <Box mt={3} />
          <RHFTextField
            name="email"
            control={control}
            label="Email"
            type="email"
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
              label={signupMutation.isPending ? "Creating account..." : "Create Account"}
              disabled={signupMutation.isPending || !isValid}
            />
          </Box>
        </form>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              component={NextLink}
              href="/login"
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
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}