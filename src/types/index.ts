export type Story = {
  id: string;
  type: "video" | "image";
  src: string;
};

export type StoryGroup = {
  id: string;
  title: string;
  stories: Story[];
  src: string;
};
