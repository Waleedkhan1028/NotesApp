import { useMutation } from '@tanstack/react-query';
import { SIGNUP_ENDPOINTS } from '../../EndPoints/signup/index';
// Import the type from schemas
import { SignupFormData } from '../../../lib/schemas';

// Remove the interface since we're importing it
// interface SignupRequest { ... }

interface SignupResponse {
  username: string;
  email: string;
  message: string;
}

export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupFormData>({
    mutationFn: async (signupData: SignupFormData) => {
      const response = await fetch(SIGNUP_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      return await response.json();
    },
  });
};

// Remove useSignupValidation since Yup handles validation in the form
// export const useSignupValidation = () => { ... }