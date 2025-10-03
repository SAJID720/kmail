
import React, { useState } from 'react';
import AuthLayout from './AuthLayout';

interface LoginPageProps {
  onLoginSuccess: (user: { email: string; name: string }) => void;
  onSwitchToSignup: () => void;
  onSwitchToForgot: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToSignup, onSwitchToForgot }) => {
  const [email, setEmail] = useState('you@kmails.local');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in both fields.');
      return;
    }
    // Mock login success
    console.log('Logging in with:', { email, password });
    onLoginSuccess({ email, name: 'Demo User' });
  };

  return (
    <AuthLayout title="Sign In">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>
        <div className="text-right">
          <button type="button" onClick={onSwitchToForgot} className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
            Forgot password?
          </button>
        </div>
        <button type="submit" className="w-full bg-sky-600 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:bg-sky-700 transition-colors">
          Sign In
        </button>
      </form>
      <div className="text-center mt-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
            Sign Up
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;