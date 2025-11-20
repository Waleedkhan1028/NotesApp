"use client";

import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
   
  };
   
}

export default function CustomSnackbar({
  open,
  message,
  severity = "success",
  onClose,
  autoHideDuration = 3000,
  anchorOrigin = { vertical: "bottom", horizontal: "left" },
}: CustomSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          fontSize: "1rem",
          fontWeight: 500,
        }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
