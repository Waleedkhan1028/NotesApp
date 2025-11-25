"use client";
import React from "react";
import { Button, Box, Stack, IconButton, Typography, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { noteSchema, NoteFormData } from "../../../lib/schemas";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, TAG_OPTIONS } from "../lib/constants";
import RHFTextField from "../../_core/components/form/RHFTextField";
import RHFSelect from "../../_core/components/form/RHFSelect";
import RHFRadioGroup from "../../_core/components/form/RHFRadioGroup";
import RHFCheckboxGroup from "../../_core/components/form/RHFCheckbox";
import RHFTextarea from "../../_core/components/form/RHFTextArea";

interface NoteFormModalProps {
  open: boolean;
  editing: string | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: NoteFormData) => void;
  onCancel: () => void;
  initialValues?: Partial<NoteFormData>;
}

export default function NoteFormModal({ open, editing, isLoading, onClose, onSubmit, onCancel, initialValues }: NoteFormModalProps) {
  const { control, handleSubmit, formState: { isValid } } = useForm<NoteFormData>({
    resolver: yupResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "personal",
      priority: "medium",
      tags: [],
      ...initialValues
    },
    mode: "onChange"
  });

  const handleFormSubmit = (data: NoteFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      aria-labelledby="note-form-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 650,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          p: 4,
          borderRadius: 3,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {editing ? "Edit Note" : "Add New Note"}
          </Typography>
          <IconButton onClick={onCancel}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={3}>
            <RHFTextField
              name="title"
              control={control}
              label="Title"
            />

            <RHFSelect
              name="category"
              control={control}
              label="Category"
              options={CATEGORY_OPTIONS}
            />

            <RHFRadioGroup
              name="priority"
              control={control}
              label="Priority"
              options={PRIORITY_OPTIONS}
            />

            <RHFCheckboxGroup
              name="tags"
              control={control}
              label="Tags"
              options={TAG_OPTIONS}
            />

            <RHFTextarea
              name="content"
              control={control}
              label="Content"
              rows={6}
            />

            <Box display="flex" gap={1.5} justifyContent="flex-end" pt={2}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isLoading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !isValid}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {isLoading ? "Saving..." : editing ? "Update Note" : "Add Note"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}