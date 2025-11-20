import React from "react";
import { Controller, Control, FieldValues } from "react-hook-form";
import TextField from "@mui/material/TextField";

interface Props<T extends FieldValues> {
  name: string;
  control: Control<T>;
  label?: string;
  type?: string;
  disabled?: boolean;
  rules?: Record<string, any>; 
}

export function RHFTextField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  disabled = false,
  rules,
}: Props<T>) {
  return (
    <Controller
      name={name as any}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          fullWidth
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ""}
          variant="outlined"
          size="medium"
        />
      )}
    />
  );
}

export default RHFTextField;
