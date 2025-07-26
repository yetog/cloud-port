
export const generateWebsiteUrl = (image: string, demoUrl?: string): string => {
  // Handle special cases first
  if (demoUrl && demoUrl !== '#') {
    // Clean up the demo URL if it already looks like a website
    if (demoUrl.includes('www.') || demoUrl.includes('.com') || demoUrl.includes('.org') || demoUrl.includes('.net')) {
      // Add https if not present
      if (!demoUrl.startsWith('http')) {
        return `https://${demoUrl}`;
      }
      return demoUrl;
    }
  }

  // Extract filename from image path
  const filename = image.split('/').pop()?.replace('.png', '').replace('.jpg', '').replace('.jpeg', '') || '';
  
  // Handle special cases based on filename
  if (filename === 'ta2music' || filename === 'TA2') {
    return 'https://www.ta2music.com';
  }
  
  if (filename === 'zen-reset') {
    return 'http://zaylegend.com/zen-reset';
  }
  
  // Default case: filename + .com
  return `https://${filename}.com`;
};

export const validateWebsiteUrl = async (url: string): Promise<boolean> => {
  try {
    // Simple validation - check if URL is well-formed
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
