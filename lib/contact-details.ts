export function phoneLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Display the supplied local number, but make Sri Lankan mobile calls work internationally.
  return `tel:${/^07\d{8}$/.test(digits) ? `+94${digits.slice(1)}` : `${phone.trim().startsWith("+") ? "+" : ""}${digits}`}`;
}
