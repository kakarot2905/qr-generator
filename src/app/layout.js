import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "QR Forge — QR Code Generator",
  description:
    "Generate customizable QR codes for URLs, text, WiFi, email, phone numbers and contact cards. Sign in to save your QR codes.",
  keywords: ["QR code", "generator", "QR maker", "WiFi QR", "vCard QR"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
