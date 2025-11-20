import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from "@mui/material";

interface RadioOption {
  value: string;
  label: string;
}

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: readonly RadioOption[];
  disabled?: boolean;
  rules?: Record<string, any>;
}

export function RHFRadioGroup<T extends FieldValues>({
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
        <FormControl component="fieldset" error={!!fieldState.error} disabled={disabled}>
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup {...field} value={field.value || ''}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {fieldState.error && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

export default RHFRadioGroup;