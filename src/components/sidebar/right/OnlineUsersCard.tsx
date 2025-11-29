
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const OnlineUsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

const OnlineUsersCard = () => {
  return (
    <Card className="bg-card rounded-lg border border-border shadow-md w-full">
      <CardContent className="p-3 flex items-center justify-center space-x-2">
        <OnlineUsersIcon />
        <span className="font-bold text-blue-800">- Online Users</span>
      </CardContent>
    </Card>
  );
};

export default OnlineUsersCard;
