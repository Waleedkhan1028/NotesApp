export const CATEGORY_OPTIONS = [
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'ideas', label: 'Ideas' },
  { value: 'todo', label: 'To-Do' },
] as const;

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

export const TAG_OPTIONS = [
  { value: 'important', label: 'Important' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'review', label: 'Needs Review' },
  { value: 'completed', label: 'Completed' },
] as const;

export type CategoryOption = typeof CATEGORY_OPTIONS[number]['value'];
export type PriorityOption = typeof PRIORITY_OPTIONS[number]['value'];
export type TagOption = typeof TAG_OPTIONS[number]['value'];