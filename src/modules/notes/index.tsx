"use client";
import React, { useState } from "react";
import {Paper,Typography, Box, Button,IconButton,Chip,Alert,CircularProgress,Snackbar,} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import Layout from "../../../styles/Layout";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNotes,  useCreateNote,  useUpdateNote,  useDeleteNote, type Note,} from "../../api/ApiHooks/notes/index";
import { noteSchema, NoteFormData } from "../../lib/schemas";
import NoteFormModal from "../../modules/notes/components/noteFormModal";
import NoteDetailModal from "../../modules/notes/components/noteDetailModal";
import { useSnackbar } from "../../context/SnackbarContext";
export default function NotesPage() {
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  


  const { data: notes, isLoading: notesLoading, error: notesError, refetch } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
    const { showSnackbar } = useSnackbar(); 

  const onSubmit: SubmitHandler<NoteFormData> = async (data) => {
    if (editing) {
     
      updateNote.mutate(
        { id: editing, data },
        {
          onSuccess: (response: any) => {
           showSnackbar(response.message || "Note updated successfully!", "success");
            setEditing(null);
            setAddModalOpen(false);
          },
          onError: (error: any) => {
            showSnackbar(error?.response?.data?.message || "Failed to update note!", "error");
          },
        }
      );
    } else {
     
      createNote.mutate(data, {
        onSuccess: (response: any) => {
         showSnackbar(response.message || "Note created successfully!", "success");
          setAddModalOpen(false);
        },
        onError: (error: any) => {
          showSnackbar(error?.response?.data?.message || "Failed to create note!", "error");
        },
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    deleteNote.mutate(id, {
      onSuccess: () => {
        showSnackbar('Note deleted successfully!');
      },
      onError: (error:any) => {
          showSnackbar(error?.response?.data?.message || "Failed to delete note!", "error");
      },
    });
  };

  const handleEdit = (note: Note) => {
    setEditing(note._id);
    setSelectedNote(null);
    setAddModalOpen(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setAddModalOpen(false);
  };

  const handleAddNew = () => {
    setEditing(null);
    setAddModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };


  const isLoading = notesLoading || createNote.isPending || updateNote.isPending || deleteNote.isPending;

  return (
    <Layout>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          My Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={isLoading}
          sx={{
            borderRadius: 8,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          Add Note
        </Button>
      </Box>

    
      {notesError && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          {notesError.message}
        </Alert>
      )}

     
      {notesLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {!notes || notes.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No notes yet.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click the "Add Note" button to create your first note!
              </Typography>
            </Paper>
          ) : (
            notes.map((note) => (
              <Paper key={note._id} sx={{ p: 3, mb: 2 }} >
                <Box display="flex" justifyContent="space-between"  alignItems="flex-start">
                  <Box flex={1} sx={{ cursor: 'pointer' }} onClick={() => setSelectedNote(note)}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="h6">{note.title}</Typography>
                      <Chip 
                        label={note.priority} 
                        size="small" 
                        color={getPriorityColor(note.priority) as any}
                      />
                      <Chip 
                        label={note.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                    </Typography>

                    {note.tags && note.tags.length > 0 && (
                      <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
                        {note.tags.map(tag => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(note.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box ml={2}>
                    <IconButton 
                      onClick={() => handleEdit(note)}
                      color="primary"
                      disabled={isLoading}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(note._id)}
                      color="error"
                      disabled={isLoading}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))
          )}
        </>
      )}

     
      <NoteFormModal
        open={addModalOpen}
        editing={editing}
        isLoading={isLoading}
        onClose={handleCancel}
        onSubmit={onSubmit}
        onCancel={handleCancel}
      />

   
      <NoteDetailModal
        open={!!selectedNote}
        note={selectedNote}
        isLoading={isLoading}
        onClose={() => setSelectedNote(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

 

    </Layout>
  );
}