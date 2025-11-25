"use client";
import React from "react";
import { Box, Typography, IconButton, Chip, Divider, Button, Modal } from "@mui/material";
import { Close, Edit, Delete } from "@mui/icons-material";
import { Note } from "../types/note";

interface NoteDetailModalProps {
  open: boolean;
  note: Note | null;
  isLoading: boolean;
  onClose: () => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteDetailModal({ open, note, isLoading, onClose, onEdit, onDelete }: NoteDetailModalProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (!note) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="note-detail-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 650,
          maxHeight: '85vh',
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
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {note.title}
          </Typography>
          <IconButton onClick={onClose} sx={{ mt: -1 }}>
            <Close />
          </IconButton>
        </Box>

        <Box display="flex" gap={1} mb={3} flexWrap="wrap">
          <Chip
            label={note.priority}
            color={getPriorityColor(note.priority) as any}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={note.category}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          {note.tags && note.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, mb: 3 }}>
          {note.content}
        </Typography>

        <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created: {new Date(note.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Updated: {new Date(note.updatedAt).toLocaleString()}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => onEdit(note)}
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => {
                onDelete(note._id);
                onClose();
              }}
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}