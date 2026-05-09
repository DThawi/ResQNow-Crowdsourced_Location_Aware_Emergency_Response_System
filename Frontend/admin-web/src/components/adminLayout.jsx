import React from 'react';
import AdminSidebar from './adminSidebar';
import AdminHeader from './adminHeader';

const AdminLayout = ({ children, title }) => {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-[260px] flex flex-col">
        <AdminHeader title={title} />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;