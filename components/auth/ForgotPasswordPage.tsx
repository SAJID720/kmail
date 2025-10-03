
import React, { useState } from 'react';
import AuthLayout from './AuthLayout';

interface ForgotPasswordPageProps {
  onSwitchToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email.');
      return;
    }
    // Mock submission
    console.log('Sending password reset to:', email);
    setSubmitted(true);
  };

  return (
    <AuthLayout title="Reset Password">
      {submitted ? (
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-4">If an account exists for <span className="font-semibold">{email}</span>, you will receive an email with instructions on how to reset your password.</p>
          <button onClick={onSwitchToLogin} className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
            &larr; Back to Sign In
          </button>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-slate-600 dark:text-slate-300 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email-forgot" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
              <input type="email" id="email-forgot" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
            </div>
            <button type="submit" className="w-full bg-sky-600 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:bg-sky-700 transition-colors">
              Send Reset Link
            </button>
          </form>
          <div className="text-center mt-6">
              <button onClick={onSwitchToLogin} className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 text-sm">
                Back to Sign In
              </button>
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;