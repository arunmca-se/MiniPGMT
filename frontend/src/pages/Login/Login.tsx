import React from 'react';
import { useForm } from 'react-hook-form';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '../../design-system/primitives/Button/Button';
import { Input } from '../../design-system/primitives/Input/Input';

interface LoginForm {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const loginMutation = useLogin();

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">MiniPGMT</h1>
            <p className="text-neutral-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {loginMutation.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  {(loginMutation.error as any)?.response?.data?.message || 'Invalid email or password'}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Demo credentials: <span className="font-medium">john.doe@example.com</span> / <span className="font-medium">password123</span>
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Use the credentials above to sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
