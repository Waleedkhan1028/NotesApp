export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface AuthCheckResponse {
  authenticated: boolean;
  user: User | null;
  message: string;
}