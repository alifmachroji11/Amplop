import type { Category } from './categories';

export type UploadStatus = 'uploaded' | 'processing' | 'done' | 'failed';

export type Upload = {
  id: string;
  session_id: string;
  user_id: string | null;
  storage_path: string;
  status: UploadStatus;
  error: string | null;
  created_at: string;
};

export type Transaction = {
  id: string;
  session_id: string;
  user_id: string | null;
  upload_id: string | null;
  merchant: string;
  occurred_at: string;
  amount_cents: number;
  category: Category;
  confidence: number | null;
  is_blurry: boolean;
  created_at: string;
  updated_at: string;
};

export type ParseResult = {
  merchant: string;
  date: string;
  amount: number;
  direction: 'in' | 'out';
  category: Category;
  confidence: number;
  blurry: boolean;
};
