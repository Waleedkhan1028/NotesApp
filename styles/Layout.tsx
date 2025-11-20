"use client";
import React from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useAuth } from "../src/context/AuthContext"; 
import { useSnackbar } from "../src/context/SnackbarContext";
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth(); 
     const { showSnackbar } = useSnackbar(); 

  const handleLogout = async () => {
    await logout(); 
         showSnackbar( "Logout successful!", "error");
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => router.push("/notes")}
          >
            Notes App
          </Typography>
          
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>{children}</Container>
    </div>
  );
}