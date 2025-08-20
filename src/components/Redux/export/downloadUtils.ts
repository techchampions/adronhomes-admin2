// utils/downloadUtils.ts (enhance existing)
export const downloadFile = (url: string, fileName: string) => {
  // If the URL is a relative path, prepend the base URL
  const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com"}${url}`;
  
  const link = document.createElement('a');
  link.href = fullUrl;
  link.download = fileName;
  link.target = '_blank'; // Open in new tab for better user experience
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateExportFileName = (type: 'payments' | 'customers', userId: number, format: string = 'xlsx') => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '');
  return `${type}_user_${userId}_${dateStr}_${timeStr}.${format}`;
};