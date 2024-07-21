'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const Home: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push('/login');
  };

  return (
    <div>
      <h1>Welcome to Smart Home Dashboard</h1>
      {user ? (
        <nav>
          <ul>
            <li>
              <Link href="/dashboard/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link href="/dashboard/user">User Dashboard</Link>
            </li>
            <li>
              <Link href="/dashboard/sensor">Sensor Dashboard</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
