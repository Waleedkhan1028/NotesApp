export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
    userId: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
}

export interface UpdateNoteRequest extends Partial<CreateNoteRequest> {}