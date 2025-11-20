import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['personal', 'work', 'ideas', 'todo'],
    default: 'personal',
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  tags: [{
    type: String,
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

// Remove the pre-save hook since timestamps handles updatedAt automatically

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);