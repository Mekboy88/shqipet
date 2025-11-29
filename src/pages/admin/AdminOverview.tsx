import React from 'react';

const AdminOverview = () => {
  return (
    <div className="min-h-screen max-h-screen w-full max-w-full overflow-x-hidden overflow-y-auto bg-background">
      <div className="w-full max-w-full h-full p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-none space-y-4 sm:space-y-6">
          <div className="w-full">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-4">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Empty admin dashboard - all content removed as requested.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;