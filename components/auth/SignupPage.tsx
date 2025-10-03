
import React, { useState } from 'react';
import AuthLayout from './AuthLayout';

interface SignupPageProps {
  onSignupSuccess: (user: { email: string; name: string }) => void;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }
    // Mock signup success
    console.log('Signing up with:', { name, email, password });
    onSignupSuccess({ email, name });
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
        </div>
        <div>
          <label htmlFor="email-signup" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
          <input type="email" id="email-signup" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
        </div>
        <div>
          <label htmlFor="password-signup" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
          <input type="password" id="password-signup" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
        </div>
        <button type="submit" className="w-full bg-sky-600 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:bg-sky-700 transition-colors mt-2">
          Create Account
        </button>
      </form>
      <div className="text-center mt-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
            Sign In
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;