export type ThumbStatus = 'queued' | 'uploading' | 'processing' | 'done' | 'failed';
export type FailReason = 'blurry' | 'error';

export type ThumbItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: ThumbStatus;
  uploadId?: string;
  failReason?: FailReason;
};
