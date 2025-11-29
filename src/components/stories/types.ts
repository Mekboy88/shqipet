
export interface StoryData {
  id: number;
  type?: "create";
  user: {
    name: string;
    image: string;
  };
  image: string;
  label?: string;
}
