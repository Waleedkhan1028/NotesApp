import type { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromToken } from "../../../src/lib/auth";
import { NotesRepository } from "../../../src/api/Repositries/notes/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  const userId = getUserIdFromToken(token);
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    switch (req.method) {
      case 'GET':
        const notes = await NotesRepository.getNotesByUser(userId);
        return res.status(200).json(notes);

      case 'POST':
        const { title, content, category, priority, tags } = req.body;

        const validationError = await NotesRepository.validateNoteData({ 
          title, content, category, priority 
        });
        if (validationError) {
          return res.status(400).json({ message: validationError });
        }

        const newNote = await NotesRepository.createNote({
          title,
          content,
          category,
          priority,
          tags: tags || [],
          userId
        });
        
        return res.status(201).json(newNote);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Notes API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}