import { useMutation } from '@tanstack/react-query';
import { LOGIN_ENDPOINTS } from '../../EndPoints/login/index';

import { LoginFormData } from '../../../lib/schemas';



interface LoginResponse {
  username: string;
  email: string;
  message: string;
  user?: any;
}

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: async (loginData: LoginFormData) => {
      const response = await fetch(LOGIN_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return await response.json();
    },
  });
};

