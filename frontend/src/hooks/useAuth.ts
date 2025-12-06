import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api/authService';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../services/api/authService';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));

      // Clear all queries and refetch
      queryClient.clear();

      // Navigate to dashboard
      navigate('/');
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (data: AuthResponse) => {
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));

      // Clear all queries and refetch
      queryClient.clear();

      // Navigate to dashboard
      navigate('/');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Clear tokens and user data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Clear all queries
      queryClient.clear();

      // Navigate to login
      navigate('/login');
    },
  });
};

// Helper to get current user from localStorage
export const useCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Helper to check if user is authenticated
export const useIsAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};
