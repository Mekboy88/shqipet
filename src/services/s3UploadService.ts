import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export interface S3UploadResult {
  success: boolean
  fileUrl?: string
  filePath?: string
  fileName?: string
  fileSize?: number
  uploadId?: string
  error?: string
  details?: string
}

export interface S3ConnectionTest {
  success: boolean
  message?: string
  error?: string
  details?: string
  bucketName?: string
  region?: string
  objectCount?: number
  responseTime?: number
  hasListPermission?: boolean
}

export class S3UploadService {
  private static instance: S3UploadService
  private uploadConfig: any = null
  private isConfigLoaded = false

  static getInstance(): S3UploadService {
    if (!S3UploadService.instance) {
      S3UploadService.instance = new S3UploadService()
    }
    return S3UploadService.instance
  }

  private async presignUpload(body: any): Promise<{ data: any; error: any }> {
    return { data: null, error: new Error('Backend disabled') };
  }

  async loadUploadConfig() {
    throw new Error('Backend disabled');
  }

  async testConnection(): Promise<S3ConnectionTest> {
    return {
      success: false,
      error: 'Backend disabled'
    };
  }

  async uploadFile(file: File, options?: { filePath?: string; method?: 'POST' | 'PUT'; useRelay?: boolean }): Promise<S3UploadResult> {
    return {
      success: false,
      error: 'Backend disabled',
      details: 'S3 upload functionality has been disabled'
    };
  }


  async getUploadStatus(): Promise<{ s3Enabled: boolean; configured: boolean; lastTest?: Date }> {
    return {
      s3Enabled: false,
      configured: false
    };
  }
}

export const s3UploadService = S3UploadService.getInstance()
