import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

interface Props extends ButtonProps {
  label: string;
   loading?: boolean;
}

export function RHFButton({ label, loading, ...rest }: Props) {
  return <Button variant="contained" {...rest}>{label}</Button>;
}

export default RHFButton;
