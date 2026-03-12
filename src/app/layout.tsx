import type { Metadata, Viewport } from "next";
import "./globals.css";

export function generateViewport(): Viewport {
  return {
    themeColor: "#0b0f1a",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export const metadata: Metadata = {
  title: "NovaDoc | Smart Medical Assistant",
  description: "Advanced medical PDF and image analysis powered by Amazon Nova",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NovaDoc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
