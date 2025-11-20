import * as yup from 'yup';


export const loginSchema = yup.object({
  identifier: yup
    .string()
    .required('Username or email is required')
    .min(3, 'Identifier must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});


export const signupSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(30, 'Password must not exceed 30 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
});


export const noteSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  content: yup
    .string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(['personal', 'work', 'ideas', 'todo'], 'Invalid category'),
  priority: yup
    .string()
    .required('Priority is required')
    .oneOf(['low', 'medium', 'high'], 'Invalid priority'),
  tags: yup
    .array()
    .of(yup.string())
    .default([]),
});



export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;
export type NoteFormData = yup.InferType< typeof noteSchema>;