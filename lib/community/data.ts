export type CommunityPost = {
  id: string;
  title: string;
  body: string;
  author: string;
  votes: number;
  comments: Array<{
    id: string;
    author: string;
    body: string;
    createdAt: string;
  }>;
  createdAt: string;
};

export const posts: CommunityPost[] = [
  {
    id: 'welcome-to-community',
    title: 'Welcome to Community',
    body:
      'Share ideas, questions, and tips about TypeScript and our labs. This forum is SSR-rendered and public to browse. Sign in to post or vote.',
    author: 'moderator',
    votes: 12,
    comments: [
      {
        id: 'c1',
        author: 'alex',
        body: 'Stoked to try the Type Explorer lab — type hovers are slick!',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'c2',
        author: 'sam',
        body: 'Could we get TSX support in the sidebar type info?',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'feature-requests',
    title: 'Feature Requests',
    body: 'What would you like to see in future labs? Add your ideas here.',
    author: 'jordan',
    votes: 7,
    comments: [],
    createdAt: new Date().toISOString(),
  },
];

