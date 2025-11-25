import type { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromToken } from "../../../src/lib/auth";
import { NotesRepository } from "../../../src/api/Repositories/notes/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const token = req.cookies.token;
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const existingNote = await NotesRepository.getNoteById(id as string, userId);
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json(existingNote);

      case 'PUT':
        const { title, content, category, priority, tags } = req.body;

        const validationError = await NotesRepository.validateNoteData({
          title, content, category, priority
        });
        if (validationError) {
          return res.status(400).json({ message: validationError });
        }

        const updatedNote = await NotesRepository.updateNote(
          id as string,
          userId,
          { title, content, category, priority, tags: tags || [], updatedAt: new Date(), }
        );

        return res.status(200).json(updatedNote);

      case 'DELETE':
        await NotesRepository.deleteNote(id as string, userId);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Note API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}