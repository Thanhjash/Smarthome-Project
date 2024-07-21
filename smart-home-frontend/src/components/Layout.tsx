import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isAdmin }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar isAdmin={isAdmin} />
        <main className="flex-1 ml-64 p-6 grid grid-cols-1 gap-6">
          {children}
        </main>
      </div>
    </div>
  );
};
