import imageCompression from 'browser-image-compression';
import { supabase } from './supabase';

/**
 * Compresses an image file, converts it to WebP format, and uploads it to Supabase storage.
 * @param {string} userId - The user's ID
 * @param {File} file - The raw file from input
 * @returns {Promise<string>} The public URL of the uploaded image
 */
export async function uploadAvatar(userId, file) {
  if (!file) throw new Error('No file provided');
  if (!userId) throw new Error('No user ID provided');

  // 1. Compression Options
  const compressionOptions = {
    maxSizeMB: 0.1,            // Under 100KB
    maxWidthOrHeight: 400,     // 400x400 max resolution
    useWebWorker: true,
  };

  // 2. Compress the image
  let compressedFile;
  try {
    compressedFile = await imageCompression(file, compressionOptions);
  } catch (err) {
    console.warn('Image compression failed, using original file:', err);
    compressedFile = file;
  }

  // 3. Convert to WebP format via HTML5 Canvas
  let webpFile;
  try {
    webpFile = await convertToWebP(compressedFile);
  } catch (err) {
    console.warn('WebP conversion failed, uploading compressed file directly:', err);
    webpFile = compressedFile;
  }

  // 4. Upload to Supabase Storage in 'avatars' bucket
  const fileExtension = webpFile.type === 'image/webp' ? 'webp' : 'jpg';
  const filePath = `${userId}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, webpFile, {
      upsert: true,
      contentType: webpFile.type,
      cacheControl: '3600',
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // 5. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // 6. Return public URL with query parameter cache buster
  return `${publicUrl}?t=${Date.now()}`;
}

function convertToWebP(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Let's constrain the size further to 256x256 to keep it extremely tiny (under 20-30KB)
        const size = Math.min(256, Math.max(img.width, img.height));
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > size) {
            height = Math.round((height * size) / width);
            width = size;
          }
        } else {
          if (height > size) {
            width = Math.round((width * size) / height);
            height = size;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], `${file.name.split('.')[0] || 'avatar'}.webp`, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(webpFile);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        }, 'image/webp', 0.75); // 75% quality is excellent for avatars and super tiny
      };
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });
}
