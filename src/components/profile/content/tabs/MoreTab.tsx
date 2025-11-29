
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MoreTab: React.FC = () => {
  return (
    <Card className="p-4 md:p-6 shadow">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">More</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="h-12 md:h-16 justify-start text-base md:text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6 mr-3">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          Check-ins
        </Button>
        
        <Button variant="outline" className="h-12 md:h-16 justify-start text-base md:text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6 mr-3">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
          Sports
        </Button>
        
        <Button variant="outline" className="h-12 md:h-16 justify-start text-base md:text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6 mr-3">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 0 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
          Music
        </Button>
        
        <Button variant="outline" className="h-12 md:h-16 justify-start text-base md:text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6 mr-3">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h14a2 2 0 0 1-2-2v-7"></path>
            <path d="M12 2v8"></path>
            <path d="m9 5 3-3 3 3"></path>
            <path d="M9 14h.01"></path>
            <path d="M15 14h.01"></path>
            <path d="M12 16v.01"></path>
          </svg>
          Events
        </Button>
      </div>
    </Card>
  );
};

export default MoreTab;
