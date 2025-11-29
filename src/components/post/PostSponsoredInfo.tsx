
import React from "react";
import { Button } from "../ui/button";

interface PostSponsoredInfoProps {
  sponsoredInfo: {
    url: string;
    title: string;
    description: string;
    cta: string;
  };
}

const PostSponsoredInfo: React.FC<PostSponsoredInfoProps> = ({ sponsoredInfo }) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 uppercase font-medium">
          {sponsoredInfo.url}
        </div>
        <h3 className="text-lg font-bold mt-1">{sponsoredInfo.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{sponsoredInfo.description}</p>
        <div className="mt-3">
          <Button variant="outline" className="rounded-full bg-gray-200 hover:bg-gray-300 border-0 text-black font-semibold">
            {sponsoredInfo.cta}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostSponsoredInfo;
