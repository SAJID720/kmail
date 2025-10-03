
import React, { useState, useEffect } from 'react';
import type { Contact } from '../types';

interface EditContactModalProps {
  contact: Contact;
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

const EditContactModal: React.FC<EditContactModalProps> = ({ contact, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: contact.name, email: contact.email });

  useEffect(() => {
    setFormData({ name: contact.name, email: contact.email });
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.email || !formData.email.includes('@')) {
      alert("Please enter a valid email.");
      return;
    }
    onSave({ ...contact, ...formData });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-sm w-full shadow-2xl animate-fade-in">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Edit Contact</h3>
          <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100" onClick={onClose} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contact Name"
              className="mt-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Contact Email"
              className="mt-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
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
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors font-semibold"
          >
            Save
          </button>
        </footer>
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

export default EditContactModal;