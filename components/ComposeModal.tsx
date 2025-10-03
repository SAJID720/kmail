
import React, { useState, useRef, useEffect } from 'react';
import type { ComposeFormData, Template, Contact } from '../types';
import { FileTextIcon } from './icons';
import PlaceholderInputModal from './PlaceholderInputModal';

interface ComposeModalProps {
  initialData: ComposeFormData;
  templates: Template[];
  contacts: Contact[];
  onClose: () => void;
  onSend: (data: ComposeFormData) => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ initialData, templates, contacts, onClose, onSend }) => {
  const [formData, setFormData] = useState<ComposeFormData>(initialData);
  const [showTemplates, setShowTemplates] = useState(false);
  const templatesRef = useRef<HTMLDivElement>(null);
  
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [initialPlaceholderValues, setInitialPlaceholderValues] = useState<Record<string, string>>({});
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templatesRef.current && !templatesRef.current.contains(event.target as Node)) {
        setShowTemplates(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSend = () => {
    if (!formData.to) {
      alert("Please enter a recipient.");
      return;
    }
    onSend(formData);
  };

  const handleTemplateSelect = (template: Template) => {
    setShowTemplates(false);
    const fullText = `${template.subject} ${template.body}`;
    const placeholderRegex = /\[(.*?)\]/g;
    const matches = [...fullText.matchAll(placeholderRegex)];
    const uniquePlaceholders = [...new Set(matches.map(match => match[1].trim()))];

    if (uniquePlaceholders.length > 0) {
      const initialValues: Record<string, string> = {};
      const recipientContact = contacts.find(c => formData.to.includes(c.email));
      
      uniquePlaceholders.forEach(p => {
        const lowerP = p.toLowerCase();
        if (recipientContact) {
          if (lowerP === 'name' || lowerP === 'contact name' || lowerP === 'recipient name') {
            initialValues[p] = recipientContact.name.split(' ')[0]; // Use first name
          }
           if (lowerP === 'full name' || lowerP === 'full_name') {
            initialValues[p] = recipientContact.name;
          }
        }
        if (lowerP === 'subject' && formData.subject) {
            initialValues[p] = formData.subject;
        }
      });
      
      setPlaceholders(uniquePlaceholders);
      setInitialPlaceholderValues(initialValues);
      setActiveTemplate(template);
    } else {
      setFormData(prev => ({
        ...prev,
        subject: template.subject,
        body: template.body,
      }));
    }
  };
  
  const handlePlaceholderApply = (values: Record<string, string>) => {
    if (!activeTemplate) return;

    let finalSubject = activeTemplate.subject;
    let finalBody = activeTemplate.body;

    for (const [key, value] of Object.entries(values)) {
      const placeholder = new RegExp(`\\[${key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")}\\]`, 'g');
      finalSubject = finalSubject.replace(placeholder, value);
      finalBody = finalBody.replace(placeholder, value);
    }

    setFormData(prev => ({
      ...prev,
      subject: finalSubject,
      body: finalBody,
    }));
    
    resetPlaceholderState();
  };

  const resetPlaceholderState = () => {
    setActiveTemplate(null);
    setPlaceholders([]);
    setInitialPlaceholderValues({});
  };


  return (
    <>
      <div className="fixed inset-0 flex items-end sm:items-center justify-center bg-black bg-opacity-50 p-0 sm:p-4 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-t-lg sm:rounded-lg max-w-2xl w-full h-full sm:h-auto shadow-2xl flex flex-col animate-slide-up">
          <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">New Message</h3>
            <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>

          <div className="p-4 space-y-4 overflow-y-auto flex-grow">
            <div>
              <label className="text-sm font-medium text-slate-600 sr-only" htmlFor="to">To</label>
              <input
                id="to"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="Recipient"
                className="w-full px-3 py-2 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-sky-500 bg-transparent dark:text-slate-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 sr-only" htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full px-3 py-2 border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-sky-500 bg-transparent dark:text-slate-200"
              />
            </div>
            <div className="h-full">
              <label className="text-sm font-medium text-slate-600 sr-only" htmlFor="body">Message</label>
              <textarea
                id="body"
                name="body"
                rows={10}
                value={formData.body}
                onChange={handleChange}
                placeholder="Your message..."
                className="w-full h-full px-3 py-2 border-none focus:outline-none resize-none bg-transparent dark:text-slate-200"
              />
            </div>
          </div>

          <footer className="flex items-center justify-between gap-2 p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="relative" ref={templatesRef}>
              <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-semibold"
              >
                  <FileTextIcon className="w-4 h-4" />
                  <span>Templates</span>
              </button>
              {showTemplates && (
                  <div className="absolute bottom-full mb-2 w-64 bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 py-1 z-10">
                      {templates.length > 0 ? (
                          templates.map(template => (
                              <button
                                  key={template.id}
                                  onClick={() => handleTemplateSelect(template)}
                                  className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                              >
                                  {template.name}
                              </button>
                          ))
                      ) : (
                          <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No templates saved.</div>
                      )}
                  </div>
              )}
            </div>
            <div className="flex items-center gap-2">
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
                Send
              </button>
            </div>
          </footer>
        </div>
        <style>{`
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @media (min-width: 640px) {
              @keyframes slide-up {
                from { transform: translateY(2rem); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
          }
          .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        `}</style>
      </div>

      {activeTemplate && placeholders.length > 0 && (
        <PlaceholderInputModal
          placeholders={placeholders}
          initialValues={initialPlaceholderValues}
          onClose={resetPlaceholderState}
          onApply={handlePlaceholderApply}
        />
      )}
    </>
  );
};

export default ComposeModal;
