import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText } from "@mui/material";

interface CheckboxOption {
  value: string;
  label: string;
}

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: readonly CheckboxOption[];
  disabled?: boolean;
  rules?: Record<string, any>;
}

export function RHFCheckboxGroup<T extends FieldValues>({
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
      render={({ field, fieldState }) => {
        const selectedValues = field.value as string[] || [];
        
        const handleCheckboxChange = (optionValue: string) => {
          const newValue = selectedValues.includes(optionValue)
            ? selectedValues.filter(value => value !== optionValue)
            : [...selectedValues, optionValue];
          
          field.onChange(newValue);
        };

        return (
          <FormControl component="fieldset" error={!!fieldState.error} disabled={disabled}>
            <FormLabel component="legend">{label}</FormLabel>
            <FormGroup>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={selectedValues.includes(option.value)}
                      onChange={() => handleCheckboxChange(option.value)}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            {fieldState.error && (
              <FormHelperText>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}

export default RHFCheckboxGroup;