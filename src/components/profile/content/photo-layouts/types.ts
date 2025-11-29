
export interface MediaItemProps {
  url: string;
  isVideo: boolean;
  width?: number;
  height?: number;
}

export interface PhotoGridProps {
  images: string[];
  extraImagesCount?: number;
  videos?: string[];
  withBorders?: boolean;
}
