export const NOTES_ENDPOINTS = {
  NOTES: '/api/notes',
  NOTE_BY_ID: (id: string) => `/api/notes/${id}`,
} as const;