export const convertUrlsToMockFiles = async (urls: string[] | undefined) => {
  if (!urls) return [];

  const filePromises = urls.map(async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      // Extract file name from the URL, handling different URL structures
      const fileName = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
      
      // Create a real File object from the blob
      const file = new File([blob], fileName, { type: blob.type });

      return file;
    } catch (error) {
      console.error("Failed to convert URL to File object:", url, error);
      return null;
    }
  });

  // Wait for all promises to resolve and filter out any failed conversions
  const files = await Promise.all(filePromises);
  return files.filter(file => file !== null) as File[];
};