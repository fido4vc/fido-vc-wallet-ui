'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/lib/api/waltid';
import { ApiError, LoginData } from '@/lib/types';
import { setToken, setUser, setWalletId } from '@/lib/storage';
import { getWallets } from '@/lib/api/waltid';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    setError('');
    try {
      const user = await login(data);
      setToken(user.token);
      setUser({
        id: user.id,
        username: user.username,
      });
      const { wallets } = await getWallets();
      if (wallets.length !== 0) {
        setWalletId(wallets[0].id);
      }
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md text-sm space-y-1">
                <div>{error}</div>
                <div className="text-xs">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="font-medium underline hover:no-underline"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}

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
                placeholder="Enter your password"
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
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
