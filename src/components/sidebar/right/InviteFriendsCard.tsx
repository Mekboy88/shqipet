
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3.105 3.35a1 1 0 011.59-.854l12.449 6.225a1 1 0 010 1.708L4.695 17.505a1 1 0 01-1.59-.854V3.35z" />
    </svg>
);

const InviteFriendsCard = () => {
  return (
    <Card className="bg-card rounded-lg border border-border shadow-md w-full text-center">
      <CardContent className="p-4">
        <div className="flex justify-center mb-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 512 512">
            <path d="M448 64H64C46.33 64 32 78.33 32 96v320c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32V96c0-17.67-14.33-32-32-32zM256 295.1L84.84 153.64h342.32L256 295.1z" fill="#ffce31"/>
            <path d="M448 64H64c-1.2 0-2.37.07-3.52.2L256 240l195.52-175.8c-1.15-.13-2.32-.2-3.52-.2z" fill="#ffac33"/>
            <path d="M256 295.1l-192-172.8V416c0 17.67 14.33 32 32 32h320c17.67 0 32-14.33 32-32V122.3L256 295.1z" fill="#ffce31"/>
            <path d="M256 295.1L64 122.3V96c0-17.67 14.33-32 32-32h32.14l128 115.2 127.86-115.2H416c17.67 0 32 14.33 32 32v26.3L256 295.1z" fill="#ffac33"/>
            <path d="M352 128H160c-8.84 0-16 7.16-16 16v128c0 8.84 7.16 16 16 16h192c8.84 0 16-7.16 16-16V144c0-8.84-7.16-16-16-16z" fill="#f8f8f8"/>
            <path d="M344.38 174.62a40.02 40.02 0 00-56.76 0L256 206.25l-31.62-31.63a40.02 40.02 0 00-56.76 56.76L256 280l88.38-88.38a40.02 40.02 0 000-56.76z" fill="#e04f5f"/>
            </svg>
        </div>
        <h3 className="font-bold text-md mb-3 text-gray-700">Invite Your Friends</h3>
        <div className="flex">
          <Input type="email" placeholder="E-mail" className="rounded-r-none border-gray-300 focus:border-red-500 focus:ring-red-500" />
          <Button className="bg-red-600 hover:bg-red-700 rounded-l-none px-4">
            <SendIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteFriendsCard;
