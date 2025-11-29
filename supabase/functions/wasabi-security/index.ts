const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SAFE FORMATS ONLY - Industry Standard
const ALLOWED_MIME_TYPES = [
  // Images - Safe formats (including conditionally safe GIF and BMP)
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/jfif',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/bmp',
  'image/x-ms-bmp',
  'image/x-bmp',
  // Videos - Safe formats only
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mimeType, fileSize } = await req.json();

    const validations = {
      mimeTypeValid: ALLOWED_MIME_TYPES.includes(mimeType),
      fileSizeValid: fileSize <= MAX_FILE_SIZE,
      maxFileSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_MIME_TYPES,
    };

    const isValid = validations.mimeTypeValid && validations.fileSizeValid;

    return new Response(JSON.stringify({
      valid: isValid,
      ...validations,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Security validation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
