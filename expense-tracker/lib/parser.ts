export const parseUPIAmount = (text:string): number | null => {
    const amountRegex = /(?:rs\.?|₹|inr)\s*(\d+(?:\.\d{1,2})?)/i;
  const match = text.match(amountRegex);

  if(match && match[1]) {
    return parseFloat(match[1]);
  }
  return null;
}

export const extractMerchant = (text: string): string => {
  // Format 1: "at Starbucks"
  const matchAt = text.match(/at\s+([a-zA-Z0-9]+)/i);
  if (matchAt) return matchAt[1];

  // Format 2: "; Blinkit credited" (ICICI style)
  // This looks for a semicolon, optional space, captures the name, then "credited"
  const matchCredited = text.match(/;\s*([a-zA-Z0-9\s]+)\s+credited/i);
  if (matchCredited) return matchCredited[1].trim();

  return "Unknown Merchant"; 
};