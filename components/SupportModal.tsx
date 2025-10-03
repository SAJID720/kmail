import React, { useState } from 'react';
import type { Account } from '../types';

interface SupportModalProps {
  user: Account;
  onClose: () => void;
  onSend: (subject: string, body: string) => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ user, onClose, onSend }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) {
      alert("Please fill out both the subject and the message body.");
      return;
    }
    onSend(subject, body);
    setIsSent(true);
    setTimeout(() => {
        onClose();
    }, 2000); // Close modal after 2 seconds
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-lg w-full shadow-2xl animate-fade-in">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Contact Support</h3>
          <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100" onClick={onClose} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        {isSent ? (
            <div className="p-8 text-center">
                <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Thank you!</h4>
                <p className="text-slate-600 dark:text-slate-300 mt-2">Your message has been sent. Our support team will get back to you at {user.email} shortly.</p>
            </div>
        ) : (
            <>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 sr-only" htmlFor="support-subject">Subject</label>
                        <input
                        id="support-subject"
                        name="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600 sr-only" htmlFor="support-body">Message</label>
                        <textarea
                        id="support-body"
                        name="body"
                        rows={8}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="How can we help you today?"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
                        />
                    </div>
                </div>

                <footer className="flex items-center justify-end gap-2 p-4 border-t border-slate-200 dark:border-slate-700">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-semibold"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSend}
                    className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors font-semibold"
                >
                    Send Message
                </button>
                </footer>
            </>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SupportModal;
