import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YourVoice",
  description: "Text-to-Voice for Speech Disabilities",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          const size = localStorage.getItem('yv-font-size');
          if (size) {
            document.documentElement.style.setProperty(
              '--base-font', size + 'px'
            );
          }
          const mode = localStorage.getItem('yv-mode') || 'light';
          if (mode === 'dark') document.documentElement.classList.add('dark');
          if (mode === 'high-contrast') document.documentElement.classList.add('high-contrast');
        `}} />
      </head>
      <body className="antialiased min-h-screen text-[#4a4a6a]">
        {children}
      </body>
    </html>
  );
}
