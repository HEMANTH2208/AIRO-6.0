import QRCode from "qrcode";

export async function generateQRCode(registrationId: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(registrationId, {
    width: 300,
    margin: 2,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });

  return dataUrl;
}

export function generateRegistrationId(eventSlug: string): string {
  const code = eventSlug.toUpperCase().replace(/-/g, "").slice(0, 4);
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `AIRO-${code}-${timestamp}-${random}`;
}
