
export interface ProfileSidebarComponentProps {
  userData: {
    details: {
      education: string;
      location: string;
      hometown: string;
      relationship: string;
    };
  };
  transformedPhotos: Array<{
    id: number;
    url: string;
  }>;
  transformedFriends: Array<{
    id: number;
    name: string;
    imageUrl: string;
  }>;
  featuredPhotos: Array<{
    id: number;
    url: string;
  }>;
  sidebarMarginLeft: number;
}
