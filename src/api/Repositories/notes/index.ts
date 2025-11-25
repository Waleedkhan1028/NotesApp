import { dbConnect } from "../../../lib/dbConnect";
import Note from "../../../models/Note";
import { noteSchema } from '../../../lib/schemas';

export interface NoteData {
  title: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
  userId: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  category?: string;
  priority?: string;
  tags?: string[];
  updatedAt: Date;
}

export class NotesRepository {
  // Get all notes for a user
  static async getNotesByUser(userId: string) {
    await dbConnect();
    return await Note.find({ userId }).sort({ createdAt: -1 });
  }

  // Get single note by ID
  static async getNoteById(id: string, userId: string) {
    await dbConnect();
    return await Note.findOne({ _id: id, userId });
  }

  // Create new note
  static async createNote(noteData: NoteData) {
    await dbConnect();
    return await Note.create({
      ...noteData,
    });
  }

  // Update note
  static async updateNote(id: string, userId: string, updateData: UpdateNoteData) {
    await dbConnect();
    return await Note.findOneAndUpdate(
      { _id: id, userId },
      { ...updateData },
      { new: true, runValidators: true }
    );
  }

  // Delete note
  static async deleteNote(id: string, userId: string) {
    await dbConnect();
    return await Note.findOneAndDelete({ _id: id, userId });
  }

  // Validate note data using Yup
  static async validateNoteData(noteData: Partial<NoteData>): Promise<string | null> {
    try {
      // Use Yup schema for validation
      await noteSchema.validate(noteData, { abortEarly: false });
      return null;
    } catch (error: any) {
      // Return the first validation error message
      if (error.errors && error.errors.length > 0) {
        return error.errors[0];
      }
      return "Validation failed";
    }
  }
}