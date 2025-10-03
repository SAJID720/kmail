import React from 'react';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-wider">KMail</h1>
        </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 text-center mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;