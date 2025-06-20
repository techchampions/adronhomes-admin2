export const  formatToNaira = (value:any) => {
  if (!value) return "";
  const number = parseInt(value.replace(/,/g, ""), 10);
  if (isNaN(number)) return "";
  return "₦" + number.toLocaleString("en-NG");
};

// Add this at the top of your file
export const formatAsNaira = (value: any | null | undefined): string => {
  if (value === null || value === undefined) return '₦0';
  return `₦${value.toLocaleString('en-NG')}`;
};
