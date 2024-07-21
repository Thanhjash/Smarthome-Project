"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Settings, HelpCircle, History, Thermometer, Users } from 'lucide-react';

const AdminLinks = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'User Management' },
  { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

const UserLinks = [
  { href: '/dashboard/sensor', icon: Thermometer, label: 'Sensor Dashboard' },
  { href: '/dashboard/history', icon: History, label: 'History' },
];

export const Sidebar: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const pathname = usePathname();
  const links = isAdmin ? AdminLinks : UserLinks;

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4 fixed left-0 top-16 bottom-0">
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.href} className="mb-4">
              <Link href={link.href} className={`flex items-center p-2 rounded-lg ${pathname === link.href ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <link.icon className="mr-2 h-5 w-5" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
