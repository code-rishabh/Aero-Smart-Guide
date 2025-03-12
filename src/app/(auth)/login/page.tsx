'use client';

import Link from "next/link";
import { useState } from "react";
import { Shield, User, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('/login', {
        username,
        password
      });

      if (data.status) {
        const role = Number(data.role);
        console.log('Role from API:', role);

        const userData = {
          name: username,
          role: role,
          email: data.email || ''
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        Cookies.set('token', data.token, { 
          expires: 7,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        setUser(userData);
        
        toast.success('Login successful');

        // Redirect based on role
        if (role === 0) {
          console.log('Admin login, redirecting to /admin');
          router.push('/admin');
        } else {
          console.log('Creator login, redirecting to /creators');
          router.push('/creators');
        }
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {/* <div className="flex items-center space-x-2">
            <Shield className="h-10 w-10 text-brass" />
            <span className="text-2xl font-bold text-olive"></span>
          </div> */}
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-olive">
          Sign in to your account
        </h2>
        {/* <p className="mt-2 text-center text-sm text-khaki-dark">
          Or{' '}
          <Link href="/register" className="font-medium text-brass hover:text-brass-light transition-colors">
            create a new account
          </Link>
        </p> */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg border border-brass-light/20 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-olive">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-khaki" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-brass-light/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brass-light focus:border-brass-light text-olive-dark placeholder-khaki/50"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-olive">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-khaki" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-brass-light/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brass-light focus:border-brass-light text-olive-dark placeholder-khaki/50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-khaki hover:text-brass transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-khaki hover:text-brass transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-brass-light/20 text-brass focus:ring-brass-light"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-khaki-dark">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-khaki-dark hover:text-khaki-light transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-olive-dark bg-brass hover:bg-brass-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brass-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
