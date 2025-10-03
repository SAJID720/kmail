
import type { Message, Contact, Conversation, ChatMessage, Template } from './types';

export const STORAGE_MESSAGES_KEY = "kmails_gemini_messages";
export const STORAGE_CONTACTS_KEY = "kmails_gemini_contacts";
export const STORAGE_CONVERSATIONS_KEY = "kmails_gemini_conversations";
export const STORAGE_CHAT_MESSAGES_KEY = "kmails_gemini_chat_messages";
export const STORAGE_TEMPLATES_KEY = "kmails_gemini_templates";


export const MY_EMAIL = "you@kmails.local";
export const SUPPORT_EMAIL = "kshajid720@gmail.com";

export const sampleContacts: Contact[] = [
  { id: "c1", accountId: "sample", name: "Alice", email: "alice@example.com" },
  { id: "c2", accountId: "sample", name: "Bob", email: "bob@example.com" },
  { id: "me", accountId: "sample", name: "You (Me)", email: MY_EMAIL },
  { id: "c3", accountId: "sample", name: "Shop KMail", email: "deals@shop.kmail" },
  { id: "c4", accountId: "sample", name: "KMail Team", email: "team@kmail.dev" },
];

export const sampleMessages: Message[] = [
  {
    id: "m1",
    threadId: "thread-welcome",
    accountId: "sample",
    from: "alice@example.com",
    to: MY_EMAIL,
    subject: "Welcome to KMail Gemini!",
    body: "Hi! This is a demo message in your new private mail app called KMail Gemini.\n\nFeel free to explore composing, archiving, searching, and the new AI-powered Smart Reply feature.",
    date: new Date().toISOString(),
    starred: false,
    archived: false,
    read: false,
    isImportant: false,
    isPromotion: false,
    isUpdate: false,
    isTrash: false,
    status: 'sent',
  },
  {
    id: "m2",
    threadId: "thread-project",
    accountId: "sample",
    from: "bob@example.com",
    to: MY_EMAIL,
    subject: "Meeting tomorrow",
    body: "Hi team,\n\nJust a reminder that we have a project sync meeting tomorrow at 10 AM in the main conference room. Please come prepared with your updates.\n\nBest,\nBob",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    starred: true,
    archived: false,
    read: true,
    isImportant: true,
    isPromotion: false,
    isUpdate: false,
    isTrash: false,
    status: 'sent',
  },
  {
    id: "m3",
    threadId: "thread-welcome",
    accountId: "sample",
    from: MY_EMAIL,
    to: "alice@example.com",
    subject: "Re: Welcome to KMail Gemini!",
    body: "Thanks, Alice! The app looks great. Looking forward to using it.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    starred: false,
    archived: false,
    read: true,
    isImportant: false,
    isPromotion: false,
    isUpdate: false,
    isTrash: false,
    status: 'sent',
  },
  {
    id: "m4",
    threadId: "thread-deals",
    accountId: "sample",
    from: "deals@shop.kmail",
    to: MY_EMAIL,
    subject: "🔥 50% Off Everything!",
    body: "Our biggest sale of the year is here! Get 50% off all items, this weekend only. Don't miss out!",
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    starred: false,
    archived: false,
    read: false,
    isImportant: false,
    isPromotion: true,
    isUpdate: false,
    isTrash: false,
    status: 'sent',
  },
  {
    id: "m5",
    threadId: "thread-updates",
    accountId: "sample",
    from: "team@kmail.dev",
    to: MY_EMAIL,
    subject: "Your KMail Account: Security Update",
    body: "We've updated our terms of service and privacy policy. Please review the changes at your earliest convenience.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    starred: false,
    archived: false,
    read: true,
    isImportant: false,
    isPromotion: false,
    isUpdate: true,
    isTrash: false,
    status: 'sent',
  },
  {
    id: "m6",
    threadId: "thread-project",
    accountId: "sample",
    from: MY_EMAIL,
    to: "bob@example.com",
    subject: "Brainstorming for project",
    body: "Hey Bob, let's get together sometime next week to brainstorm ideas for the new project. I have a few thoughts I want to run by you.",
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    starred: false,
    archived: false,
    read: true,
    isImportant: false,
    isPromotion: false,
    isUpdate: false,
    isTrash: false,
    status: 'draft',
  },
  {
    id: "m7",
    threadId: "thread-spam",
    accountId: "sample",
    from: "spam@example.com",
    to: MY_EMAIL,
    subject: "You've won!",
    body: "Click here to claim your prize!",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    starred: false,
    archived: false,
    read: true,
    isImportant: false,
    isPromotion: true,
    isUpdate: false,
    isTrash: true,
    status: 'sent',
  }
];

export const sampleConversations: Conversation[] = [
    { id: 'conv1', accountId: 'sample', participantEmails: [MY_EMAIL, 'alice@example.com']},
    { id: 'conv2', accountId: 'sample', participantEmails: [MY_EMAIL, 'bob@example.com']},
];

export const sampleChatMessages: ChatMessage[] = [
    { id: 'cm1', conversationId: 'conv1', senderEmail: 'alice@example.com', text: 'Hey! How are you finding the new messenger feature?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'cm2', conversationId: 'conv1', senderEmail: MY_EMAIL, text: 'It\'s amazing! So smooth. Want to try a video call?', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
    { id: 'cm3', conversationId: 'conv2', senderEmail: 'bob@example.com', text: 'About the meeting, are we still on for 10?', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

export const sampleTemplates: Template[] = [
    { id: 't1', accountId: 'sample', name: 'Meeting Follow-up', subject: 'Following up on our meeting', body: 'Hi [Name],\n\nThanks for meeting with me today. I\'ve attached the documents we discussed.\n\nBest,\n' },
    { id: 't2', accountId: 'sample', name: 'Thank You', subject: 'Thank you!', body: 'Hi [Name],\n\nJust wanted to send a quick note to say thank you for [Reason].\n\nI really appreciate it.\n\nBest,\n' }
];