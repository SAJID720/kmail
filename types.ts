
export interface Account {
  id: string;
  name: string;
  email: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
}

export interface Message {
  id:string;
  threadId?: string;
  accountId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  starred: boolean;
  archived: boolean;
  read: boolean;
  isImportant: boolean;
  isPromotion: boolean;
  isUpdate: boolean;
  isTrash: boolean;
  status: 'sent' | 'draft';
}

export interface Contact {
  id: string;
  accountId: string;
  name: string;
  email: string;
}

export type Folder = "inbox" | "archived" | "sent" | "starred" | "drafts" | "important" | "promotions" | "updates" | "trash";

export interface ComposeFormData {
  to: string;
  subject: string;
  body: string;
  threadId?: string;
}

export interface SearchFilters {
  query: string;
  from: string;
  subject: string;
  startDate: string;
  endDate: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderEmail: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  accountId: string;
  participantEmails: string[];
}

export interface Template {
  id: string;
  accountId: string;
  name: string;
  subject: string;
  body: string;
}