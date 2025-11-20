"use client";
import React from "react";
import {TextField,Button,Box,Stack,IconButton,FormControl,InputLabel,Select,MenuItem,FormControlLabel,Radio,RadioGroup,FormLabel,FormGroup,Typography, Modal,} from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { noteSchema, NoteFormData } from "../../../lib/schemas";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, TAG_OPTIONS } from "../lib/constants";

interface NoteFormModalProps {
  open: boolean;
  editing: string | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: NoteFormData) => void;
  onCancel: () => void;
  initialValues?: Partial<NoteFormData>;
}

export default function NoteFormModal({open, editing, isLoading, onClose, onSubmit, onCancel, initialValues}: NoteFormModalProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = useForm<NoteFormData>({
    resolver: yupResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "personal",
      priority: "medium",
      tags: [],
      ...initialValues
    }
  });


  

  const handleTagChange = (tagValue: string) => {
    const currentTags = watch('tags');
    const newTags = currentTags.includes(tagValue)
      ? currentTags.filter(tag => tag !== tagValue)
      : [...currentTags, tagValue];
    
    setValue('tags', newTags);
  };

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
          maxWidth: 600,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            {editing ? "Edit Note" : "Add New Note"}
          </Typography>
          <IconButton onClick={onCancel}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={3}>
            {/* Title */}
            <TextField
              label="Title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
            />

            {/* Category */}
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                {...register("category")}
              >
                {CATEGORY_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error">
                  {errors.category.message}
                </Typography>
              )}
            </FormControl>

            {/* Priority Radio Group */}
            <FormControl component="fieldset" error={!!errors.priority}>
              <FormLabel component="legend">Priority</FormLabel>
              <RadioGroup row {...register("priority")}>
                {PRIORITY_OPTIONS.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              {errors.priority && (
                <Typography variant="caption" color="error">
                  {errors.priority.message}
                </Typography>
              )}
            </FormControl>

            {/* Tags Checkbox Group */}
            <FormControl component="fieldset">
              <FormLabel component="legend">Tags</FormLabel>
              <FormGroup row>
                {TAG_OPTIONS.map(option => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={watch('tags').includes(option.value)}
                        onChange={() => handleTagChange(option.value)}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>
            </FormControl>

            {/* Content */}
            <TextField
              label="Content"
              multiline
              rows={6}
              {...register("content")}
              error={!!errors.content}
              helperText={errors.content?.message}
              fullWidth
            />

            <Box display="flex" gap={1} justifyContent="flex-end">
              <Button 
                variant="outlined" 
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={isLoading || !isValid}
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