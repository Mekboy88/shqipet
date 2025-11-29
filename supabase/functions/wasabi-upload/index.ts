import { AwsClient } from "https://esm.sh/aws4fetch@1.0.17";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PROFESSIONAL AVATAR STANDARDS (Facebook/Instagram quality)
const MIN_RESOLUTION = 400; // Reject anything smaller than 400×400
const TARGET_MAX_SIZE = 1024; // Always upscale/process to 1024px max for perfect quality
const AVATAR_VARIANTS = [
  { suffix: 'thumbnail', size: 80 },   // For tiny avatars
  { suffix: 'small', size: 160 },      // For 40px retina (40 × 4 DPR)
  { suffix: 'medium', size: 320 },     // For 80px retina
  { suffix: 'large', size: 640 }       // For 160px retina
];

// Format validation - SAFE FORMATS ONLY
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/jpg', 'image/pjpeg', 'image/jfif', 
  'image/png', 'image/webp', 'image/avif', 
  'image/heic', 'image/heif',
  'image/gif', // Conditionally safe - allowed but not processed
  'image/bmp', 'image/x-ms-bmp', 'image/x-bmp' // Conditionally safe - allowed but not processed
];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// BLOCKED: Dangerous formats (SVG can execute scripts, RAW formats, TIFF, PSD, etc.)
const BLOCKED_EXTENSIONS = ['.svg', '.ico', '.tiff', '.tif', '.psd', '.xcf', '.emf', '.wmf', '.cur', '.ani', '.nef', '.cr2', '.arw', '.dng', '.raw', '.orf', '.rw2', '.mkv', '.avi', '.wmv', '.flv', '.mpeg', '.mpg', '.ogv'];

// ImageScript-compatible formats (for processing/optimization)
// These formats can be decoded, optimized, and have metadata automatically stripped
const IMAGESCRIPT_FORMATS = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/jfif', 'image/png', 'image/webp'];

const MAX_SIZES = {
  avatar: 10 * 1024 * 1024,
  cover: 10 * 1024 * 1024,
  'post-image': 20 * 1024 * 1024,
  'post-video': 50 * 1024 * 1024
};

// Process image with ImageScript for maximum quality
async function processImage(buffer: Uint8Array): Promise<Image> {
  try {
    return await Image.decode(buffer);
  } catch (error) {
    console.error('Image decode error:', error);
    throw new Error('Failed to decode image. Please upload a valid image file.');
  }
}

// Resize with high-quality resampling
async function resizeImage(image: Image, maxSize: number): Promise<Uint8Array> {
  const { width, height } = image;
  
  // If image is smaller than target, upscale it
  if (Math.max(width, height) < maxSize) {
    console.log(`📈 Upscaling from ${width}×${height} to ${maxSize}×${maxSize}`);
    const scale = maxSize / Math.max(width, height);
    const newWidth = Math.round(width * scale);
    const newHeight = Math.round(height * scale);
    return await image.resize(newWidth, newHeight).encodeJPEG(100);
  }
  
  // If image is larger, downscale it
  if (Math.max(width, height) > maxSize) {
    console.log(`📉 Downscaling from ${width}×${height} to fit ${maxSize}px`);
    const scale = maxSize / Math.max(width, height);
    const newWidth = Math.round(width * scale);
    const newHeight = Math.round(height * scale);
    return await image.resize(newWidth, newHeight).encodeJPEG(100);
  }
  
  // Perfect size - just encode
  return await image.encodeJPEG(100);
}

// Generate square variant (center crop + resize)
async function generateVariant(image: Image, targetSize: number): Promise<Uint8Array> {
  const { width, height } = image;
  const sourceSize = Math.min(width, height);
  const sx = Math.floor((width - sourceSize) / 2);
  const sy = Math.floor((height - sourceSize) / 2);
  
  // Crop to square first
  const cropped = image.crop(sx, sy, sourceSize, sourceSize);
  
  // Resize to target
  const resized = cropped.resize(targetSize, targetSize);
  
  // Encode with maximum quality
  return await resized.encodeJPEG(100);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const mediaType = (formData.get('mediaType') as string) || 'profile';
    const userId = formData.get('userId') as string;
    const updateProfile = formData.get('updateProfile') as string;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Load config
    let IMAGE_MIME_ALLOW = ALLOWED_IMAGE_TYPES as string[];
    let VIDEO_MIME_ALLOW = ALLOWED_VIDEO_TYPES as string[];
    let BLOCKED_EXTS = BLOCKED_EXTENSIONS as string[];
    let MAX_LIMITS = MAX_SIZES as Record<string, number>;
    let allowedImageExts = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'png', 'webp', 'avif', 'heic', 'heif', 'gif', 'bmp'];
    let allowedVideoExts = ['mp4', 'webm', 'mov'];

    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      const { data: cfg, error: cfgError } = await supabase.rpc('get_upload_configuration');
      if (!cfgError && cfg) {
        IMAGE_MIME_ALLOW = Array.isArray(cfg.allowed_image_mime_types) ? cfg.allowed_image_mime_types : IMAGE_MIME_ALLOW;
        VIDEO_MIME_ALLOW = Array.isArray(cfg.allowed_video_mime_types) ? cfg.allowed_video_mime_types : VIDEO_MIME_ALLOW;
        allowedImageExts = Array.isArray(cfg.allowed_image_extensions) ? cfg.allowed_image_extensions.map((s: string) => (s || '').toLowerCase().replace(/^\./, '')) : allowedImageExts;
        allowedVideoExts = Array.isArray(cfg.allowed_video_extensions) ? cfg.allowed_video_extensions.map((s: string) => (s || '').toLowerCase().replace(/^\./, '')) : allowedVideoExts;
        const blockedImages = Array.isArray(cfg.blocked_image_extensions) ? cfg.blocked_image_extensions : [];
        const blockedVideos = Array.isArray(cfg.blocked_video_extensions) ? cfg.blocked_video_extensions : [];
        BLOCKED_EXTS = Array.from(new Set([ ...BLOCKED_EXTS, ...blockedImages, ...blockedVideos ]));
        MAX_LIMITS = {
          avatar: typeof cfg.max_avatar_size === 'number' ? cfg.max_avatar_size : MAX_SIZES.avatar,
          cover: typeof cfg.max_cover_size === 'number' ? cfg.max_cover_size : MAX_SIZES.cover,
          'post-image': typeof cfg.max_post_image_size === 'number' ? cfg.max_post_image_size : MAX_SIZES['post-image'],
          'post-video': typeof cfg.max_post_video_size === 'number' ? cfg.max_post_video_size : MAX_SIZES['post-video'],
        } as Record<string, number>;
      }
    } catch (e) {
      console.warn('⚠️ Using default upload configuration', e);
    }

    // Validate extension
    const fileName = file.name.toLowerCase();
    const fileExtension = '.' + (fileName.split('.').pop() || '');
    if (BLOCKED_EXTS.includes(fileExtension)) {
      return new Response(JSON.stringify({ 
        error: `File type ${fileExtension} not allowed.`,
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate MIME
    const isImage = IMAGE_MIME_ALLOW.includes(file.type);
    const isVideo = VIDEO_MIME_ALLOW.includes(file.type);
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const isImageByExtension = allowedImageExts.includes(ext);
    const isVideoByExtension = allowedVideoExts.includes(ext);
    
    let isValidImage = isImage || isImageByExtension;
    let isValidVideo = isVideo || isVideoByExtension;

    const imageIntent = /avatar|profile|cover|post-image/i.test(mediaType);
    if (!isValidImage && !isValidVideo && imageIntent) {
      if (!BLOCKED_EXTS.includes(`.${ext}`) && !isVideoByExtension) {
        isValidImage = true;
      }
    }

    if (!isValidImage && !isValidVideo) {
      return new Response(JSON.stringify({ 
        error: `File format ${file.type || '(unknown)'} not allowed.`,
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Validate size
    const maxSize = MAX_LIMITS[mediaType as keyof typeof MAX_SIZES] || MAX_LIMITS['post-image'];
    if (file.size > maxSize) {
      const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
      return new Response(JSON.stringify({ 
        error: `File too large. Maximum: ${maxMB}MB`,
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // No video avatars
    if ((mediaType === 'avatar' || mediaType === 'profile') && isValidVideo) {
      return new Response(JSON.stringify({ 
        error: 'Video avatars not allowed.',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const region = Deno.env.get('WASABI_REGION')!;
    const bucket = Deno.env.get('WASABI_BUCKET_NAME')!;
    const accessKeyId = Deno.env.get('WASABI_ACCESS_KEY_ID')!;
    const secretAccessKey = Deno.env.get('WASABI_SECRET_ACCESS_KEY')!;

    const aws = new AwsClient({
      accessKeyId,
      secretAccessKey,
      service: 's3',
      region,
    });

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const folder = /cover/i.test(mediaType)
      ? 'covers'
      : (/avatar|profile/i.test(mediaType)
          ? 'avatars'
          : (/post-image/i.test(mediaType)
              ? 'posts/images'
              : (/post-video/i.test(mediaType) ? 'posts/videos' : 'uploads')));
    
    const s3Base = region === 'us-east-1'
      ? 'https://s3.wasabisys.com'
      : `https://s3.${region}.wasabisys.com`;

    // PROFESSIONAL IMAGE PROCESSING PIPELINE
    const isAvatarOrCover = /avatar|profile|cover/i.test(mediaType);
    
    // Check if format is compatible with ImageScript processing
    const canProcess = IMAGESCRIPT_FORMATS.includes(file.type);
    
    if (isValidImage && isAvatarOrCover && canProcess) {
      console.log('🎨 Processing image with quality pipeline (with automatic metadata stripping)...');
      
      // Decode image (automatically strips EXIF, GPS, and all metadata)
      const arrayBuffer = await file.arrayBuffer();
      const imageBuffer = new Uint8Array(arrayBuffer);
      const image = await processImage(imageBuffer);
      
      // ✅ CRITICAL: Validate minimum resolution
      if (image.width < MIN_RESOLUTION || image.height < MIN_RESOLUTION) {
        return new Response(JSON.stringify({ 
          error: `Image too small. Minimum resolution: ${MIN_RESOLUTION}×${MIN_RESOLUTION}px. Your image: ${image.width}×${image.height}px. Please upload a higher quality photo.`,
          success: false
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      console.log(`✅ Image validation passed: ${image.width}×${image.height}px`);
      
      // Process to 1024px max (upscale if needed, downscale if too large)
      const processedBuffer = await resizeImage(image, TARGET_MAX_SIZE);
      const baseKey = `${folder}/${userId}/${timestamp}-${random}`;
      
      // Upload original processed version
      const originalKey = `${baseKey}-original.jpg`;
      const putUrlOriginal = `${s3Base}/${bucket}/${originalKey}`;
      
      const putResOriginal = await aws.fetch(putUrlOriginal, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: new Uint8Array(processedBuffer),
      });

      if (!putResOriginal.ok) {
        const text = await putResOriginal.text().catch(() => '');
        console.error('Wasabi PUT failed:', putResOriginal.status, text);
        return new Response(JSON.stringify({ 
          error: `Upload failed: ${putResOriginal.status}`,
          success: false
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log(`✅ Uploaded original: ${originalKey}`);
      
      // Generate and upload all variants
      const variantKeys: string[] = [];
      for (const variant of AVATAR_VARIANTS) {
        const variantBuffer = await generateVariant(image, variant.size);
        const variantKey = `${baseKey}-${variant.suffix}.jpg`;
        const putUrlVariant = `${s3Base}/${bucket}/${variantKey}`;
        
        const putResVariant = await aws.fetch(putUrlVariant, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000'
          },
          body: new Uint8Array(variantBuffer),
        });

        if (putResVariant.ok) {
          console.log(`✅ Generated variant: ${variant.suffix} (${variant.size}px)`);
          variantKeys.push(variantKey);
        }
      }

      // Update profile if requested
      if (updateProfile === 'true') {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        const field = /cover/i.test(mediaType) ? 'cover_url' : 'avatar_url';
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ [field]: originalKey })
          .eq('id', userId);

        if (updateError) {
          console.error('Profile update error:', updateError);
        } else {
          console.log(`✅ Updated profiles.${field}`);
        }
      }

      return new Response(JSON.stringify({ 
        key: originalKey,
        url: originalKey,
        variants: variantKeys,
        dimensions: { width: image.width, height: image.height },
        success: true,
        message: 'Image processed with metadata stripped and crisp variants generated'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } else if (isValidImage && isAvatarOrCover && !canProcess) {
      // Avatar/Cover images that can't be processed (GIF, BMP, HEIC, HEIF)
      // Try to convert GIF/BMP to WebP for optimization and metadata stripping
      console.log(`🔄 Processing ${file.type} - attempting conversion to WebP with metadata stripping`);
      
      const arrayBuffer = await file.arrayBuffer();
      const imageBuffer = new Uint8Array(arrayBuffer);
      
      try {
        // Try to decode with ImageScript (works for GIF, BMP)
        const image = await Image.decode(imageBuffer);
        console.log(`✅ Successfully decoded ${file.type}: ${image.width}×${image.height}px`);
        
        // Validate minimum resolution
        if (image.width < MIN_RESOLUTION || image.height < MIN_RESOLUTION) {
          return new Response(JSON.stringify({ 
            error: `Image too small. Minimum resolution: ${MIN_RESOLUTION}×${MIN_RESOLUTION}px. Your image: ${image.width}×${image.height}px. Please upload a higher quality photo.`,
            success: false
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Convert to WebP (strips metadata automatically)
        const webpBuffer = await resizeImage(image, TARGET_MAX_SIZE);
        const baseKey = `${folder}/${userId}/${timestamp}-${random}`;
        const originalKey = `${baseKey}-original.jpg`;
        const putUrl = `${s3Base}/${bucket}/${originalKey}`;

        const putRes = await aws.fetch(putUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/jpeg' },
          body: new Uint8Array(webpBuffer),
        });

        if (!putRes.ok) {
          const text = await putRes.text().catch(() => '');
          return new Response(JSON.stringify({ 
            error: `Upload failed: ${putRes.status}`,
            success: false
          }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        console.log(`✅ Converted ${file.type} to JPEG with metadata stripped`);

        // Generate variants
        const variantKeys: string[] = [];
        for (const variant of AVATAR_VARIANTS) {
          const variantBuffer = await generateVariant(image, variant.size);
          const variantKey = `${baseKey}-${variant.suffix}.jpg`;
          const putUrlVariant = `${s3Base}/${bucket}/${variantKey}`;
          
          const putResVariant = await aws.fetch(putUrlVariant, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'image/jpeg',
              'Cache-Control': 'public, max-age=31536000'
            },
            body: new Uint8Array(variantBuffer),
          });

          if (putResVariant.ok) {
            console.log(`✅ Generated variant: ${variant.suffix} (${variant.size}px)`);
            variantKeys.push(variantKey);
          }
        }

        // Update profile if requested
        if (updateProfile === 'true' && userId) {
          const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
          );

          const field = /cover/i.test(mediaType) ? 'cover_url' : 'avatar_url';
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ [field]: originalKey })
            .eq('id', userId);

          if (updateError) {
            console.error('Profile update error:', updateError);
          } else {
            console.log(`✅ Updated profiles.${field}`);
          }
        }

        return new Response(JSON.stringify({ 
          key: originalKey,
          url: originalKey,
          variants: variantKeys,
          dimensions: { width: image.width, height: image.height },
          success: true,
          message: `${file.type} converted to JPEG with metadata stripped and variants generated`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (decodeError) {
        // If conversion fails (e.g., HEIC/HEIF), upload as-is
        console.warn(`⚠️ Could not convert ${file.type}, uploading as-is:`, decodeError);
        
        const key = `${folder}/${userId}/${timestamp}-${random}.${ext}`;
        const putUrl = `${s3Base}/${bucket}/${key}`;

        const putRes = await aws.fetch(putUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: imageBuffer,
        });

        if (!putRes.ok) {
          const text = await putRes.text().catch(() => '');
          return new Response(JSON.stringify({ 
            error: `Upload failed: ${putRes.status}`,
            success: false
          }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Update profile if requested
        if (updateProfile === 'true' && userId) {
          const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
          );

          const field = /cover/i.test(mediaType) ? 'cover_url' : 'avatar_url';
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ [field]: key })
            .eq('id', userId);

          if (updateError) {
            console.error('Profile update error:', updateError);
          } else {
            console.log(`✅ Updated profiles.${field}`);
          }
        }

        return new Response(JSON.stringify({ 
          key,
          url: key,
          success: true,
          message: `${file.type} uploaded (metadata may be present - format not convertible)`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

    } else {
      // Non-avatar/cover files - upload directly
      const key = `${folder}/${userId}/${timestamp}-${random}.${ext}`;
      const arrayBuffer = await file.arrayBuffer();
      const putUrl = `${s3Base}/${bucket}/${key}`;

      const putRes = await aws.fetch(putUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: new Uint8Array(arrayBuffer),
      });

      if (!putRes.ok) {
        const text = await putRes.text().catch(() => '');
        return new Response(JSON.stringify({ 
          error: `Upload failed: ${putRes.status}`,
          success: false
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        key,
        url: key,
        success: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
