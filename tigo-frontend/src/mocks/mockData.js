export const MOCK_CATEGORIES = [
  { id: 1, name: 'Programming', slug: 'programming', followed: true },
  { id: 2, name: 'Technology', slug: 'technology', followed: false },
  { id: 3, name: 'Design', slug: 'design', followed: true },
  { id: 4, name: 'Writing', slug: 'writing', followed: false },
  { id: 5, name: 'Machine Learning', slug: 'machine-learning', followed: true },
  { id: 6, name: 'Productivity', slug: 'productivity', followed: false }
];

export const MOCK_USERS = [
  { id: 1, displayName: 'Jane Doe', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', bio: 'Software Engineer and Writer. Exploring the intersection of tech and society.', followers: 12400, following: 150 },
  { id: 2, displayName: 'John Smith', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', bio: 'Tech enthusiast sharing lessons learned the hard way.', followers: 892, following: 45 },
  { id: 3, displayName: 'Alice Johnson', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', bio: 'Product Designer at TechCorp. Writing about pixels and people.', followers: 3400, following: 210 },
  { id: 4, displayName: 'Bob Williams', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', bio: 'Avid reader and occasional writer focusing on productivity.', followers: 120, following: 50 }
];

export const MOCK_COMMENTS = [
  { id: 1, author: MOCK_USERS[1], content: 'This is incredibly insightful. I never thought about organizing my components this way!', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), clapCount: 12 },
  { id: 2, author: MOCK_USERS[3], content: 'Great article. However, I disagree with the point about Tailwind. While utility classes can get messy, the speed of iteration usually outweighs the drawbacks for small teams.', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), clapCount: 5 }
];

const richContentBlocks = [
    {"id":"intro","type":"paragraph","data":{"text":"Building a React app in 2026 is very different from a few years ago. We now have incredible tools at our disposal that make the process smoother and faster. This article explores the choices I made and why they worked for this specific scale of application."}},
    {"id":"h1","type":"header","data":{"text":"1. The Foundation","level":2}},
    {"id":"p1","type":"paragraph","data":{"text":"Before we dive into the code, it's crucial to understand the foundation. A strong foundation allows your application to scale without crumbling under its own weight. I always start by defining my core data models and service layers before touching any UI components."}},
    {"id":"h2","type":"header","data":{"text":"2. Architectural Decisions","level":2}},
    {"id":"p2","type":"paragraph","data":{"text":"We chose a modular architecture. By decoupling our UI from the state management, we were able to swap out libraries easily. For instance, moving from Redux to Zustand was a breeze because our components didn't know the difference."}},
    {"id":"p3","type":"paragraph","data":{"text":"<i>This is where the magic happens.</i> Once the architecture is set, the rest flows naturally. You spend less time worrying about how data gets from point A to point B, and more time crafting the user experience."}},
    {"id":"h3","type":"header","data":{"text":"3. The Component Hierarchy","level":2}},
    {"id":"p4","type":"paragraph","data":{"text":"Keeping components small and focused is the oldest advice in the React playbook, but it remains the most important. A component should do one thing and do it well."}},
    {"id":"h4","type":"header","data":{"text":"4. Final Thoughts","level":2}},
    {"id":"p5","type":"paragraph","data":{"text":"In conclusion, modern web development is a constant balancing act between shipping fast and writing maintainable code. But with the right patterns, you can do both. The key is to be intentional about your dependencies and clear about your boundaries."}}
];

export const MOCK_POSTS = [
  {
    id: 101,
    title: 'How I built a modern React application from scratch in 2026',
    slug: 'how-i-built-a-modern-react-application',
    excerpt: 'A comprehensive guide to the tools, libraries, and architectural decisions that shaped my latest project, from initial setup to deployment.',
    coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    readTimeMin: 7,
    clapCount: 342,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: MOCK_USERS[0],
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[1]],
    content: JSON.stringify({time:1710000000000, blocks: richContentBlocks, version:"2.29.1"})
  },
  {
    id: 102,
    title: 'The Future of AI in Software Engineering: A deep dive into LLM integration',
    slug: 'the-future-of-ai-in-software-engineering',
    excerpt: 'Will AI replace programmers? Short answer: No. Long answer: It will change how we work fundamentally.',
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    readTimeMin: 12,
    clapCount: 1205,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: MOCK_USERS[1],
    category: MOCK_CATEGORIES[4],
    tags: [MOCK_CATEGORIES[4]],
    content: '{"time":1710000000000,"blocks":[{"id":"paragraph1","type":"paragraph","data":{"text":"AI is eating the world, but it still needs someone to feed it."}}],"version":"2.29.1"}'
  },
  {
    id: 103,
    title: 'A minimalist guide to typography',
    slug: 'minimalist-guide-typography',
    excerpt: 'Typography is 90% of web design. Master these few principles and your designs will instantly look more professional.',
    coverImageUrl: null, 
    readTimeMin: 4,
    clapCount: 56,
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: MOCK_USERS[2],
    category: MOCK_CATEGORIES[2],
    tags: [MOCK_CATEGORIES[2]],
    content: '{"time":1710000000000,"blocks":[{"id":"paragraph1","type":"paragraph","data":{"text":"Serifs and Sans-Serifs..."}}],"version":"2.29.1"}'
  },
  {
    id: 104,
    title: 'Why I stopped using Tailwind CSS',
    slug: 'why-i-stopped-using-tailwind',
    excerpt: 'An unpopular opinion on why utility-first CSS might not be the silver bullet we all thought it was.',
    coverImageUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&q=80',
    readTimeMin: 8,
    clapCount: 890,
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    author: MOCK_USERS[0],
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_CATEGORIES[0]],
    content: '{"time":1710000000000,"blocks":[{"id":"paragraph1","type":"paragraph","data":{"text":"Controversial take here."}}],"version":"2.29.1"}'
  }
];

export const MOCK_RECOMMENDED_TOPICS = MOCK_CATEGORIES;
export const MOCK_WHO_TO_FOLLOW = MOCK_USERS;

export const MOCK_FEATURED_POSTS = [
  {
    id: 201,
    title: 'GenRec: Towards LLM-Native Recommendation at Netflix',
    slug: 'genrec-llm-native-recommendation-netflix',
    excerpt: 'How Netflix is rethinking its recommendation engine from the ground up using large language models and a new retrieval architecture.',
    coverImageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=1200&q=80',
    readTimeMin: 14,
    clapCount: 2541,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: 5, displayName: 'Netflix TechBlog', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Netflix', bio: 'Engineering insights from Netflix.', followers: 89400, following: 12 },
    category: MOCK_CATEGORIES[4],
    tags: [MOCK_CATEGORIES[4], MOCK_CATEGORIES[1]],
    content: '{"time":1710000000000,"blocks":[{"id":"paragraph1","type":"paragraph","data":{"text":"At Netflix, recommendations power everything from the home screen to the notifications you receive."}}],"version":"2.29.1"}'
  },
  {
    id: 202,
    title: 'Should You Self-Host Inference?',
    slug: 'should-you-self-host-inference',
    excerpt: 'The honest economics of running your own models, and the hidden costs that most blog posts conveniently forget to mention.',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    readTimeMin: 9,
    clapCount: 891,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: 6, displayName: 'Paolo Perrone', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paolo', bio: 'ML Infrastructure at Scale.', followers: 4200, following: 88 },
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_CATEGORIES[1], MOCK_CATEGORIES[4]],
    content: '{"time":1710000000000,"blocks":[{"id":"paragraph1","type":"paragraph","data":{"text":"Self-hosting your own inference stack sounds amazing until you get the first GPU bill."}}],"version":"2.29.1"}'
  },
  {
    id: 203,
    title: 'The Design Principles Behind Linear\'s New UI',
    slug: 'design-principles-behind-linear-ui',
    excerpt: 'A breakdown of the subtle craft decisions that make Linear feel faster than any other project management tool.',
    coverImageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1200&q=80',
    readTimeMin: 6,
    clapCount: 1780,
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: 7, displayName: 'Adham Dannaway', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adham', bio: 'UI/UX Designer writing about design craft.', followers: 15600, following: 203 },
    category: MOCK_CATEGORIES[2],
    tags: [MOCK_CATEGORIES[2]],
    content: '{"time":1710000000000,"blocks":[{"id":"paragraph1","type":"paragraph","data":{"text":"Linear feels fast. Not just technically fast — perceptually fast."}}],"version":"2.29.1"}'
  },
  {
    id: 204,
    title: 'Postgres is Enough: Stop Over-Engineering Your Stack',
    slug: 'postgres-is-enough',
    excerpt: 'Redis for caching, Elasticsearch for search, Kafka for queues — or you could just use Postgres for all of it.',
    coverImageUrl: null,
    readTimeMin: 11,
    clapCount: 4320,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: 8, displayName: 'Stephan Schmidt', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stephan', bio: 'Former CTO. Writing about engineering leadership.', followers: 22100, following: 67 },
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[1]],
    content: '{"time":1710000000000,"blocks":[{"id":"paragraph1","type":"paragraph","data":{"text":"Every new database you add to your stack is another thing that can go down at 3 AM."}}],"version":"2.29.1"}'
  }
];
