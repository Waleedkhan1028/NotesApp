import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

interface SelectOption {
  value: string;
  label: string;
}

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: readonly SelectOption[];
  disabled?: boolean;
  rules?: Record<string, any>;
}

export function RHFSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled = false,
  rules,
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={!!fieldState.error} disabled={disabled}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            value={field.value || ''}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {fieldState.error && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

export default RHFSelect;