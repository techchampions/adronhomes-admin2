export const convertUrlsToMockFiles = (urls: string[] | undefined) => {
  if (!urls) return [];
  return urls.map(url => {
    // Extract the file name from the URL
    // const fileName = url.substring(url.lastIndexOf('/') + 1);
    
    // Return an object that mimics a File object with at least a 'name' property
    return {
      name: url,
      url: url, // Store the original URL for reference if needed
      isFromServer: true // Add a flag to distinguish it from new uploads
    } as any; // Use `as any` or define a custom type if you're using strict TypeScript
  });
};