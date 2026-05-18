'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { register as registerUser } from '@/lib/api/waltid';
import { ApiError, RegisterData } from '@/lib/types';

type RegisterForm = RegisterData & { confirmPassword: string };

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-600 dark:text-green-400">
              Registration Successful!
            </CardTitle>
            <CardDescription className="text-center">
              Redirecting you to the login page...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md text-sm space-y-1">
                <div>{error}</div>
                <div className="text-xs">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium underline hover:no-underline"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Max Mustermann"
                {...register('name', { required: true })}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@email.com"
                {...register('email', { required: true })}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...register('password', { required: true })}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
