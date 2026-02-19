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
    parentId?: string;
    replies: Array<{
      id: string;
      author: string;
      body: string;
      createdAt: string;
      parentId?: string;
      replies: any[];
    }>;
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
        replies: [
          {
            id: 'c1r1',
            author: 'moderator',
            body: 'Thanks! We put a lot of effort into making the type information clear and accessible.',
            createdAt: new Date().toISOString(),
            parentId: 'c1',
            replies: [
              {
                id: 'c1r1r1',
                author: 'alex',
                body: 'It really shows! The real-time feedback makes learning so much easier.',
                createdAt: new Date().toISOString(),
                parentId: 'c1r1',
                replies: [],
              },
            ],
          },
          {
            id: 'c1r2',
            author: 'sarah',
            body: 'Agreed! The visual feedback when hovering over types is fantastic.',
            createdAt: new Date().toISOString(),
            parentId: 'c1',
            replies: [],
          },
        ],
      },
      {
        id: 'c2',
        author: 'sam',
        body: 'Could we get TSX support in the sidebar type info?',
        createdAt: new Date().toISOString(),
        replies: [
          {
            id: 'c2r1',
            author: 'jordan',
            body: 'TSX support would be amazing! Component prop types are sometimes tricky to work out.',
            createdAt: new Date().toISOString(),
            parentId: 'c2',
            replies: [],
          },
          {
            id: 'c2r2',
            author: 'moderator',
            body: 'Great suggestion! We\'re working on expanding the language support. TSX is definitely on our roadmap.',
            createdAt: new Date().toISOString(),
            parentId: 'c2',
            replies: [],
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'typescript-tips-tricks',
    title: 'Your Best TypeScript Tips & Tricks',
    body: 'What are some TypeScript patterns or techniques that have made your code better? Share your favorites here!',
    author: 'sarah',
    votes: 24,
    comments: [
      {
        id: 'tip1',
        author: 'mike_dev',
        body: 'Using `satisfies` operator has been a game changer for me. You get type checking without losing the literal types:\n\n```typescript\nconst config = {\n  database: "postgresql",\n  port: 5432\n} satisfies Config;\n```',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        replies: [
          {
            id: 'tip1r1',
            author: 'elena',
            body: 'This is brilliant! I\'ve been struggling with this exact problem. Thanks for sharing!',
            createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
            parentId: 'tip1',
            replies: [
              {
                id: 'tip1r1r1',
                author: 'mike_dev',
                body: 'Glad it helps! The `satisfies` operator was added in TS 4.9 and it\'s one of my favorite features.',
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                parentId: 'tip1r1',
                replies: [],
              },
            ],
          },
          {
            id: 'tip1r2',
            author: 'carlos',
            body: 'I had no idea about this! Been using `as const` everywhere. This looks much cleaner.',
            createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
            parentId: 'tip1',
            replies: [],
          },
        ],
      },
      {
        id: 'tip2',
        author: 'luna_codes',
        body: 'Template literal types for creating type-safe APIs:\n\n```typescript\ntype HttpMethod = "GET" | "POST" | "PUT" | "DELETE";\ntype Endpoint = `/${string}`;\ntype ApiRoute = `${HttpMethod} ${Endpoint}`;\n\n// Now you get autocomplete for: "GET /users", "POST /auth", etc.\n```',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: 'tip2r1',
            author: 'dev_ninja',
            body: 'Mind = blown 🤯 This is exactly what I needed for my API client library!',
            createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
            parentId: 'tip2',
            replies: [],
          },
        ],
      },
      {
        id: 'tip3',
        author: 'alex',
        body: 'Branded types for preventing mix-ups:\n\n```typescript\ntype UserId = string & { __brand: "UserId" };\ntype ProductId = string & { __brand: "ProductId" };\n\n// Now you can\'t accidentally pass a ProductId where UserId is expected!\n```',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: 'tip3r1',
            author: 'sarah',
            body: 'This is so clever! I\'ve made that exact mistake with IDs before. Definitely adopting this pattern.',
            createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
            parentId: 'tip3',
            replies: [
              {
                id: 'tip3r1r1',
                author: 'alex',
                body: 'Right? It\'s saved me so many debugging sessions. The type system becomes your safety net.',
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                parentId: 'tip3r1',
                replies: [],
              },
            ],
          },
        ],
      },
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'debugging-type-errors',
    title: 'Help: Complex Type Error I Can\'t Figure Out',
    body: 'I\'m getting this error and I\'m stumped:\n\n```\nType \'{ name: string; age: number; }\' is not assignable to type \'User\'\n```\n\nBut my User type is defined as `{ name: string; age: number }`. What am I missing?',
    author: 'newbie_dev',
    votes: 8,
    comments: [
      {
        id: 'debug1',
        author: 'typescript_guru',
        body: 'This usually happens when your `User` type has optional properties or additional constraints. Can you share the full `User` type definition?',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        replies: [
          {
            id: 'debug1r1',
            author: 'newbie_dev',
            body: 'Oh! You\'re right, I have `interface User { name: string; age: number; id?: string; }`. I forgot about the optional id!',
            createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            parentId: 'debug1',
            replies: [
              {
                id: 'debug1r1r1',
                author: 'typescript_guru',
                body: 'Exactly! You can either add the `id` property or use `Omit<User, "id">` if you want to exclude it.',
                createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
                parentId: 'debug1r1',
                replies: [],
              },
              {
                id: 'debug1r1r2',
                author: 'helper_bot',
                body: 'Pro tip: You can also use `Pick<User, "name" | "age">` to select only the properties you need!',
                createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                parentId: 'debug1r1',
                replies: [],
              },
            ],
          },
        ],
      },
      {
        id: 'debug2',
        author: 'elena',
        body: 'I always use the TypeScript playground to debug these issues. The error messages are much clearer there!',
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        replies: [],
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'feature-requests',
    title: 'Feature Requests',
    body: 'What would you like to see in future labs? Add your ideas here.',
    author: 'jordan',
    votes: 15,
    comments: [
      {
        id: 'feat1',
        author: 'react_dev',
        body: 'A React hooks lab would be amazing! Especially covering custom hooks with proper TypeScript typing.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: 'feat1r1',
            author: 'vue_enthusiast',
            body: '+1 for React content! But also would love to see Vue 3 composition API examples.',
            createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
            parentId: 'feat1',
            replies: [],
          },
        ],
      },
      {
        id: 'feat2',
        author: 'backend_dev',
        body: 'Node.js + TypeScript best practices lab please! Express middleware typing is always tricky.',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: 'feat2r1',
            author: 'fullstack_sam',
            body: 'Yes! And maybe include tRPC or GraphQL examples too?',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            parentId: 'feat2',
            replies: [
              {
                id: 'feat2r1r1',
                author: 'backend_dev',
                body: 'tRPC would be perfect! End-to-end type safety is the dream.',
                createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                parentId: 'feat2r1',
                replies: [],
              },
            ],
          },
        ],
      },
      {
        id: 'feat3',
        author: 'data_scientist',
        body: 'What about a lab on TypeScript for data processing? Working with CSV, JSON, and API responses.',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        replies: [],
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'learning-resources',
    title: 'Best TypeScript Learning Resources',
    body: 'I\'m putting together a list of the best TypeScript learning materials. What are your top recommendations?',
    author: 'study_buddy',
    votes: 31,
    comments: [
      {
        id: 'resource1',
        author: 'book_worm',
        body: 'The TypeScript Handbook is obviously essential, but I also really recommend "Programming TypeScript" by Boris Cherny. Great deep dive into advanced concepts.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: 'resource1r1',
            author: 'pragmatic_dev',
            body: 'Second this! That book helped me understand conditional types finally.',
            createdAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
            parentId: 'resource1',
            replies: [],
          },
        ],
      },
      {
        id: 'resource2',
        author: 'video_learner',
        body: 'For video content, Matt Pocock\'s TypeScript tips on Twitter/YouTube are gold. Short, practical, and mind-blowing.',
        createdAt: new Date(Date.now() - 3.8 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: 'resource2r1',
            author: 'social_coder',
            body: 'His "TypeScript wizardry" posts are amazing! I bookmark every single one.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            parentId: 'resource2',
            replies: [],
          },
        ],
      },
      {
        id: 'resource3',
        author: 'practice_makes_perfect',
        body: 'Don\'t forget type challenges! https://github.com/type-challenges/type-challenges - great for practicing advanced type manipulation.',
        createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: 'resource3r1',
            author: 'challenge_accepted',
            body: 'These are addictive! Started with easy ones and now I\'m attempting the extreme challenges.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            parentId: 'resource3',
            replies: [
              {
                id: 'resource3r1r1',
                author: 'practice_makes_perfect',
                body: 'The extreme ones are no joke! But they really make you think about how the type system works.',
                createdAt: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
                parentId: 'resource3r1',
                replies: [],
              },
            ],
          },
        ],
      },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

