"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import axios from "axios";
import SideNav from "./SideNav";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { setUser } = useAuth();
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    const res = await axios.get("/api/auth/verifytoken");
    if (res.data) {
      setUser(res.data.user);
    }
  };
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
        <SideNav>{children}</SideNav>
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
