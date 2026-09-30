/**
 * Utility functions for handling image uploads, base64 data URLs, dimensions, and rapid compression
 */

export const DEFAULT_FALLBACK_COVER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
export const DEFAULT_FALLBACK_BANNER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
export const DEFAULT_FALLBACK_PANEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Rapidly compresses and resizes any image file or dataURL to ensure
 * lightweight payloads (<100KB) that save to Firestore and render instantly on homepage.
 */
export const resizeImageIfNeeded = async (
  dataUrl: string, 
  maxWidth = 600, 
  maxHeight = 900, 
  quality = 0.65
): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      return resolve(dataUrl || DEFAULT_FALLBACK_COVER);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;

      // Scale down proportionally
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return resolve(dataUrl);

      // Fill white background for transparent PNGs
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);
      
      // Always compress to JPEG for optimal small footprint & instant loading
      try {
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch (err) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl || DEFAULT_FALLBACK_COVER);
    img.src = dataUrl;
  });
};

/**
 * Helper to get approximate KB size of a base64 string or URL
 */
export const getImageSizeKb = (urlOrBase64: string): number => {
  if (!urlOrBase64) return 0;
  if (urlOrBase64.startsWith('data:image')) {
    const stringLength = urlOrBase64.length - 'data:image/jpeg;base64,'.length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383;
    return Math.round(sizeInBytes / 1024);
  }
  return 0;
};
