export function generateGoogleMapsLink(location: string): string {
  const encoded = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}
