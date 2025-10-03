
import React, { useState, useEffect } from 'react';

interface PlaceholderInputModalProps {
  placeholders: string[];
  initialValues: Record<string, string>;
  onClose: () => void;
  onApply: (values: Record<string, string>) => void;
}

const PlaceholderInputModal: React.FC<PlaceholderInputModalProps> = ({ placeholders, initialValues, onClose, onApply }) => {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize state with placeholders as keys and initial values or empty strings
    const initial = placeholders.reduce((acc, key) => {
      acc[key] = initialValues[key] || '';
      return acc;
    }, {} as Record<string, string>);
    setValues(initial);
  }, [placeholders, initialValues]);

  const handleChange = (placeholder: string, value: string) => {
    setValues(prev => ({ ...prev, [placeholder]: value }));
  };

  const handleApply = () => {
    onApply(values);
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[60] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full shadow-2xl animate-fade-in">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Fill in Template Details</h3>
          <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100" onClick={onClose} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {placeholders.map(placeholder => (
            <div key={placeholder}>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor={`placeholder-${placeholder}`}>{capitalize(placeholder.replace(/_/g, ' '))}</label>
              <input
                id={`placeholder-${placeholder}`}
                name={placeholder}
                value={values[placeholder] || ''}
                onChange={(e) => handleChange(placeholder, e.target.value)}
                placeholder={`Enter value for [${placeholder}]`}
                className="mt-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          ))}
        </div>

        <footer className="flex items-center justify-end gap-2 p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors font-semibold"
          >
            Apply Template
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

export default PlaceholderInputModal;
