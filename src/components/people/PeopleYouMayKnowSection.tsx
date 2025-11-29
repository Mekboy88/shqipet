import React, { useRef, useState } from "react";
import { X, MoreHorizontal, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import PeopleEmptyState from "./PeopleEmptyState";
import { useLocalization } from '@/hooks/useLocalization';
import "./people-section.css";

interface Person {
  id: number;
  name: string;
  image: string;
  info?: string;
  mutualFriends?: number;
  followedBy?: string;
}

const PeopleYouMayKnowSection = () => {
  const peopleContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const { t } = useLocalization();

  // Show demo people suggestions for now (in a real app, this would fetch from API)
  const hasPeopleSuggestions = true;

  const people: Person[] = [{
    id: 1,
    name: "Sara Smith",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    followedBy: "3.9K"
  }, {
    id: 2,
    name: "Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    followedBy: "2.1K"
  }, {
    id: 3,
    name: "Emily Johnson",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    mutualFriends: 4
  }, {
    id: 4,
    name: "David Wilson",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    mutualFriends: 2
  }, {
    id: 5,
    name: "Rachel Kim",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    followedBy: "1.2K"
  }];

  const scrollPeople = (direction: 'left' | 'right') => {
    if (peopleContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      peopleContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      if (direction === 'right') {
        setShowLeftButton(true);
      }
      if (direction === 'left' && peopleContainerRef.current.scrollLeft + scrollAmount <= 0) {
        setShowLeftButton(false);
      }
    }
  };

  const handleScroll = () => {
    if (peopleContainerRef.current) {
      setShowLeftButton(peopleContainerRef.current.scrollLeft > 0);
    }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 px-4">
          {t('feed.people_section_title', 'People You May Know')}
        </h2>
      </div>
      
      <Card className="rounded-lg shadow overflow-hidden">
        {hasPeopleSuggestions ? (
          <div className="relative">
            {showLeftButton && <button className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100" onClick={() => scrollPeople('left')} aria-label="View previous people">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>}
            
            <button className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100" onClick={() => scrollPeople('right')} aria-label="View more people">
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <div style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }} ref={peopleContainerRef} onScroll={handleScroll} className="flex overflow-x-auto hide-scrollbar px-2 pb-1 bg-gray-200">
              {people.map(person => <div key={person.id} className="flex-shrink-0 person-card-container mr-2 rounded-lg overflow-hidden border border-gray-200">
                  <div className="relative person-card">
                    <button className="absolute top-1 right-1 z-10 w-5 h-5 bg-gray-200 bg-opacity-80 rounded-full flex items-center justify-center hover:bg-gray-300">
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                    
                    {/* Rectangular image container */}
                    <div className="w-full h-[210px] relative overflow-hidden">
                      <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                      {/* Smoke shade overlay - now visible by default */}
                      <div className="absolute inset-0 smoke-shade"></div>
                    </div>
                    
                    <div className="p-2">
                      <h4 className="text-base font-semibold">{person.name}</h4>
                      
                      <div className="flex gap-1 mt-2 -ml-1">
                        <Button className="flex-1 text-xs font-semibold py-0.5 shadow-sm border" variant="ghost" style={{
                          background: 'linear-gradient(to right, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 50%, rgba(127, 29, 29, 0.1) 100%)',
                          borderColor: 'rgba(220, 38, 38, 0.3)'
                        }}>
                          <span style={{
                            background: 'linear-gradient(to right, #dc2626 0%, #ef4444 50%, #7f1d1d 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                          }}>
                            Më bëj shok
                          </span>
                        </Button>
                        
                        <Button className="flex-1 text-xs font-semibold py-0.5 shadow-sm border" variant="ghost" style={{
                          background: 'linear-gradient(to right, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 50%, rgba(127, 29, 29, 0.1) 100%)',
                          borderColor: 'rgba(220, 38, 38, 0.3)'
                        }}>
                          <span style={{
                            background: 'linear-gradient(to right, #dc2626 0%, #ef4444 50%, #7f1d1d 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                          }}>
                            Qkemi
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        ) : (
          <PeopleEmptyState />
        )}
      </Card>
    </>
  );
};

export default PeopleYouMayKnowSection;
