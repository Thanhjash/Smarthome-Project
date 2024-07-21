"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';

interface User {
  username: string;
  email: string;
  _id: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        fetchUsers();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoftDelete = async (userId: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/users/soft-delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to soft delete user');
      }
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error soft deleting user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/users/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/users/approveUser`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error data:', errorData);
        throw new Error('Failed to approve user');
      }
      const updatedUser = await response.json();
      setUsers(users.map(user => (user._id === userId ? { ...user, status: 'approved' } : user)));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  return (
    <Layout isAdmin={true}>
      <div className="grid grid-cols-1 gap-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{users.filter(user => user.status === 'approved').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{users.filter(user => user.status === 'pending').length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b dark:border-gray-700">Username</th>
                      <th className="py-2 px-4 border-b dark:border-gray-700">Email</th>
                      <th className="py-2 px-4 border-b dark:border-gray-700">Status</th>
                      <th className="py-2 px-4 border-b dark:border-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="py-2 px-4 border-b dark:border-gray-700">{user.username}</td>
                        <td className="py-2 px-4 border-b dark:border-gray-700">{user.email}</td>
                        <td className="py-2 px-4 border-b dark:border-gray-700">{user.status}</td>
                        <td className="py-2 px-4 border-b dark:border-gray-700">
                          {user.status === 'pending' && (
                            <Button onClick={() => handleApprove(user._id)} className="mr-2">Approve</Button>
                          )}
                          <Button onClick={() => handleSoftDelete(user._id)} variant="secondary" className="mr-2">Soft Delete</Button>
                          <Button onClick={() => handleDelete(user._id)} variant="danger">Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
