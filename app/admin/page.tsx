import React from 'react';
import AdminDashboard from '@/components/charts/AdminDashboard';

export const metadata = { title: 'Admin Dashboard – EUROPA.VOTE' };

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-offwhite to-white">
      <AdminDashboard />
    </div>
  );
}
