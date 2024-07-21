"use client";

import React from 'react';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Smart Home Dashboard</title>
      </head>
      <body>
        <div>
          <header>
            <nav>
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/dashboard/admin">Admin Dashboard</Link>
            <Link href="/dashboard/user">User Dashboard</Link>
            <Link href="/profile">Profile</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
