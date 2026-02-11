export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  
  try {
    // Try to parse the date
    let date: Date;
    
    // Check if it's in DD/MM/YYYY format
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts.map(part => parseInt(part, 10));
        // Note: month is 0-indexed in JavaScript Date
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(dateString);
      }
    } else {
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      // Try another approach for DD/MM/YYYY
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        // Try YYYY-MM-DD format which Date constructor can parse
        date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      } else {
        return "Invalid date";
      }
    }
    
    if (isNaN(date.getTime())) return "Invalid date";
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  } catch {
    return "Invalid date";
  }
};