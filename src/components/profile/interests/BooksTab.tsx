
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface Book {
  id: number;
  name: string;
  imageUrl: string;
}

interface BooksTabProps {
  books: Book[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BooksTab: React.FC<BooksTabProps> = ({ books, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'read', label: 'Read' },
    { id: 'books', label: 'Books' }
  ];
  
  return (
    <div className="w-full">
      {/* Books tabs navigation */}
      <div className="flex border-b mb-4">
        {tabOptions.map((tab) => (
          <Button 
            key={tab.id}
            variant="ghost"
            className={`py-2 px-4 rounded-none font-medium ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      
      {/* Books content */}
      {books.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {books.map(book => (
            <div key={book.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
              <div className="h-14 w-14 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{book.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <BookOpen size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No {activeTab === 'read' ? 'read books' : 'books'} to display</p>
        </div>
      )}
      
      {/* See all button */}
      {books.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium">
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export default BooksTab;
