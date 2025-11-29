
export interface OTPVerificationResult {
  success: boolean;
  error?: string;
}

export interface OTPMetadata {
  otp_hash: string;
  contact: string;
  contact_type: 'email' | 'phone';
  expires_at: string;
  used?: boolean;
  verified_at?: string;
}
