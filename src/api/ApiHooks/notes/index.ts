import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NOTES_ENDPOINTS } from '../../EndPoints/notes/index';
import { NoteFormData } from '../../../lib/schemas';

export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}




export const useNotes = () => {
  return useQuery<Note[], Error>({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await fetch(NOTES_ENDPOINTS.NOTES);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      return await response.json();
    },
  });
};


export const useNote = (id: string) => {
  return useQuery<Note, Error>({
    queryKey: ['notes', id],
    queryFn: async () => {
      const response = await fetch(NOTES_ENDPOINTS.NOTE_BY_ID(id));
      
      if (!response.ok) {
        throw new Error('Failed to fetch note');
      }
      
      return await response.json();
    },
    enabled: !!id,
  });
};


export const useCreateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Note, Error, NoteFormData>({
    mutationFn: async (noteData: NoteFormData) => {
      const response = await fetch(NOTES_ENDPOINTS.NOTES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create note');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};


export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Note, Error, { id: string; data: Partial<NoteFormData> }>({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(NOTES_ENDPOINTS.NOTE_BY_ID(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update note');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', data._id] });
    },
  });
};


export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(NOTES_ENDPOINTS.NOTE_BY_ID(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete note');
      }
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['notes', id] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};