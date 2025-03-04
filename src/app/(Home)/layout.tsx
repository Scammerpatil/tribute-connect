"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthProvider";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" data-theme="forest">
      <head>
        <title>TributeConnect | Honor, Remember, Support</title>
        <meta
          name="description"
          content="TributeConnect is a heartfelt crowdfunding platform where users can post tributes to honor loved ones, remarkable individuals, or meaningful causes. Others can pay tribute by contributing financially, supporting memories, legacies, and impactful initiatives. Join us in celebrating lives and making a difference—one tribute at a time."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
