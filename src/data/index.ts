import { Short as ShortT, StoryGroup as StoryGroupT } from "../types";

export const storyGroups: StoryGroupT[] = [
  {
    id: "1",
    title: "Story group #1",
    src: "story-1.jpg",
    stories: [
      {
        id: "1",
        type: "image",
        src: "story-1.jpg",
      },
      {
        id: "2",
        type: "image",
        src: "story-2.jpg",
      },
    ],
  },
  {
    id: "2",
    title: "Story group #2",
    src: "story-2.jpg",
    stories: [
      {
        id: "3",
        type: "image",
        src: "story-3.jpg",
      },
      {
        id: "4",
        type: "image",
        src: "story-4.jpg",
      },
      {
        id: "5",
        type: "image",
        src: "story-5.jpg",
      },
      {
        id: "6",
        type: "image",
        src: "story-6.jpg",
      },
      {
        id: "7",
        type: "image",
        src: "story-7.jpg",
      },
    ],
  },
  {
    id: "3",
    title: "Story group #3",
    src: "story-3.jpg",
    stories: [
      {
        id: "8",
        type: "image",
        src: "story-8.jpg",
      },
      {
        id: "9",
        type: "image",
        src: "story-9.jpg",
      },
      {
        id: "10",
        type: "image",
        src: "story-10.jpg",
      },
    ],
  },
  {
    id: "4",
    title: "Story group #4",
    src: "story-4.jpg",
    stories: [
      {
        id: "8",
        type: "video",
        src: "video/story-1.mp4",
      },
      {
        id: "9",
        type: "video",
        src: "video/story-2.mp4",
      },
      {
        id: "10",
        type: "video",
        src: "video/story-3.mp4",
      },
    ],
  },
  {
    id: "5",
    title: "Story group #5",
    src: "story-5.jpg",
    stories: [
      {
        id: "11",
        type: "video",
        src: "video/story-1.mp4",
      },
      {
        id: "12",
        type: "image",
        src: "story-1.jpg",
      },
      {
        id: "13",
        type: "video",
        src: "video/story-2.mp4",
      },
      {
        id: "14",
        type: "image",
        src: "story-2.jpg",
      },
      {
        id: "15",
        type: "video",
        src: "video/story-3.mp4",
      },
    ],
  },
];

export const shorts: ShortT[] = [
  {
    id: "8",
    title: "Short #3",
    published: "1 min ago",
    storyGroup: {
      id: "8",
      title: "Story group #3",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "video",
          src: "video/story-1.mp4",
        },
      ],
    },
  },
  {
    id: "9",
    title: "Short #4",
    published: "1 min ago",
    storyGroup: {
      id: "9",
      title: "Story group #4",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "video",
          src: "video/story-2.mp4",
        },
      ],
    },
  },
  {
    id: "10",
    title: "Short #5",
    published: "1 min ago",
    storyGroup: {
      id: "10",
      title: "Story group #5",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "video",
          src: "video/story-3.mp4",
        },
      ],
    },
  },
  {
    id: "11",
    title: "Short #6",
    published: "1 min ago",
    storyGroup: {
      id: "11",
      title: "Story group #6",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "video",
          src: "video/story-1.mp4",
        },
      ],
    },
  },

  {
    id: "13",
    title: "Short #8",
    published: "1 min ago",
    storyGroup: {
      id: "13",
      title: "Story group #8",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "video",
          src: "video/story-2.mp4",
        },
      ],
    },
  },
  {
    id: "15",
    title: "Short #10",
    published: "1 min ago",
    storyGroup: {
      id: "15",
      title: "Story group #10",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "video",
          src: "video/story-3.mp4",
        },
      ],
    },
  },
  {
    id: "1",
    title: "Short #1",
    published: "1 min ago",
    storyGroup: {
      id: "1",
      title: "Story group #1",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "image",
          src: "story-1.jpg",
        },
      ],
    },
  },
  {
    id: "2",
    title: "Short #2",
    published: "1 min ago",
    storyGroup: {
      id: "2",
      title: "Story group #2",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "image",
          src: "story-2.jpg",
        },
      ],
    },
  },
  {
    id: "12",
    title: "Short #7",
    published: "1 min ago",
    storyGroup: {
      id: "12",
      title: "Story group #7",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "image",
          src: "story-1.jpg",
        },
      ],
    },
  },
  {
    id: "14",
    title: "Short #9",
    published: "1 min ago",
    storyGroup: {
      id: "14",
      title: "Story group #9",
      src: "story-1.jpg",
      stories: [
        {
          id: "1",
          type: "image",
          src: "story-2.jpg",
        },
      ],
    },
  },
];
