
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SponsoredCardProps {
  imgSrc: string;
  altText: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const SponsoredCard: React.FC<SponsoredCardProps> = ({ imgSrc, altText, title, description, link, linkText }) => {
  return (
    <Card className="bg-card rounded-lg border border-border shadow-md w-full">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-md font-semibold text-gray-500">Sponsored</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <img 
          src={imgSrc} 
          alt={altText} 
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <a href={link} className="text-sm text-red-600 hover:underline">{linkText}</a>
      </CardContent>
    </Card>
  );
};

export default SponsoredCard;
