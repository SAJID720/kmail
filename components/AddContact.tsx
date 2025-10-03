import React, { useState } from 'react';
import { ContactsIcon } from './icons';

interface AddContactProps {
  onAdd: (name: string, email: string) => void;
  onImport: (csv: string) => void;
  onDeviceSync: () => void;
}

const AddContact: React.FC<AddContactProps> = ({ onAdd, onImport, onDeviceSync }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [csv, setCsv] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!email.trim() || !email.includes('@')) {
      alert("A valid email is required.");
      return;
    }
    onAdd(name.trim() || email.trim(), email.trim());
    setName("");
    setEmail("");
  };

  const handleImport = () => {
    if (!csv.trim()) {
      alert("Paste CSV lines first.");
      return;
    }
    onImport(csv);
    setCsv("");
  };

  if (!showForm) {
      return (
          <div className="flex items-center gap-2">
              <button onClick={() => setShowForm(true)} className="flex-grow text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 py-2 rounded-md transition-colors">
                  + Add Contact
              </button>
              <button 
                  onClick={onDeviceSync} 
                  className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                  title="Sync from device"
                  aria-label="Sync contacts from device"
              >
                  <ContactsIcon className="w-5 h-5" />
              </button>
          </div>
      )
  }

  return (
    <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
      <div className="space-y-3">
        <div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Add contact</div>
            <div className="flex gap-2 items-center">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="px-2 py-1 text-sm border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email*" className="px-2 py-1 text-sm border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500" />
            </div>
             <button onClick={handleAdd} className="mt-2 w-full px-2 py-1.5 rounded-md bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-500">
                Save Contact
            </button>
        </div>

        <div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Quick import (name,email)</div>
            <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={2} placeholder="alice,alice@email.com&#10;bob,bob@email.com" className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500" />
            <button onClick={handleImport} className="mt-1 w-full px-2 py-1.5 rounded-md bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-500">
                Import from CSV
            </button>
        </div>
      </div>
       <button onClick={() => setShowForm(false)} className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mt-2">
            Cancel
      </button>
    </div>
  );
};

export default AddContact;