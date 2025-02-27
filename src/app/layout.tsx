import "./globals.css";
import type { Metadata } from "next";
import ClientRootLayout from "@/components/Layouts/ClientRootLayout";

export const metadata: Metadata = {
  title: "Ariba Dashboard",
  description: "Investor-ready dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
