import React from 'react';
import Link from 'next/link';
import { Bell, Settings, User } from 'lucide-react';
import { Button } from './ui/Button';
import { Notifications } from './Notifications';
import Image from 'next/image';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image className="h-8 w-8" src="/logo.png" alt="Logo" width={32} height={32} />
            </Link>
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Smart Home</span>
          </div>
          <div className="flex items-center space-x-4">
            <Notifications />
            <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
