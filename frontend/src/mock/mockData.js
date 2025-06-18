// Mock data for Manifest Planner Website
export const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: '/api/placeholder/150/150',
  joinDate: '2024-01-15',
  streak: 21,
  totalGoals: 12,
  completedGoals: 7
};

export const mockGoals = [
  {
    id: '1',
    title: 'Launch My Dream Business',
    description: 'Create and launch my online coaching business by December 2025',
    category: 'Career',
    targetDate: '2025-12-31',
    progress: 45,
    status: 'in-progress',
    createdAt: '2024-11-01',
    milestones: [
      { id: '1', title: 'Complete business plan', completed: true },
      { id: '2', title: 'Register business', completed: true },
      { id: '3', title: 'Build website', completed: false },
      { id: '4', title: 'Launch marketing campaign', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Perfect Health & Vitality',
    description: 'Achieve optimal health through consistent self-care and mindful living',
    category: 'Health',
    targetDate: '2025-06-30',
    progress: 72,
    status: 'in-progress',
    createdAt: '2024-10-15',
    milestones: [
      { id: '1', title: 'Exercise 5x per week', completed: true },
      { id: '2', title: 'Eat 80% whole foods', completed: true },
      { id: '3', title: 'Meditate daily', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Dream Home Manifestation',
    description: 'Manifest and move into my perfect home by the ocean',
    category: 'Lifestyle',
    targetDate: '2025-08-15',
    progress: 30,
    status: 'in-progress',
    createdAt: '2024-09-20'
  }
];

export const mockVisionBoard = {
  id: '1',
  title: 'My 2025 Vision',
  description: 'Visual representation of my dreams and goals for 2025',
  images: [
    { id: '1', url: '/api/placeholder/300/200', title: 'Dream Business', x: 10, y: 20 },
    { id: '2', url: '/api/placeholder/250/180', title: 'Perfect Health', x: 350, y: 50 },
    { id: '3', url: '/api/placeholder/280/220', title: 'Ocean Home', x: 100, y: 300 },
    { id: '4', url: '/api/placeholder/200/150', title: 'Travel Adventures', x: 450, y: 280 },
    { id: '5', url: '/api/placeholder/220/170', title: 'Loving Relationships', x: 650, y: 100 }
  ],
  affirmations: [
    'I am living my dream life with ease and joy',
    'Abundance flows to me in all areas of my life',
    'I trust the universe to guide me to my highest good'
  ],
  createdAt: '2024-11-01',
  updatedAt: '2024-12-15'
};

export const mockJournalEntries = [
  {
    id: '1',
    title: 'Amazing Synchronicity Today!',
    content: 'I had the most incredible experience today. I was thinking about my business goals and wondering how to connect with potential mentors. Then, out of nowhere, I met someone at the coffee shop who turned out to be exactly the kind of mentor I was hoping to find! She even offered to help me with my business plan. The universe is truly conspiring in my favor. I feel so grateful and aligned with my path.',
    mood: 'Grateful',
    isPublic: true,
    likes: 23,
    comments: 5,
    tags: ['synchronicity', 'business', 'gratitude', 'mentor'],
    createdAt: '2024-12-15T10:30:00Z',
    manifestationMethod: 'Visualization',
    images: ['/api/placeholder/400/250']
  },
  {
    id: '2',
    title: 'Breakthrough in My Health Journey',
    content: 'After weeks of consistent meditation and healthy eating, I finally feel the shift happening in my body and mind. My energy levels are through the roof, and I\'m sleeping better than I have in years. I\'m starting to see my body as the temple it truly is. This morning\'s yoga session was pure magic - I could feel every cell in my body vibrating with vitality.',
    mood: 'Energized',
    isPublic: true,
    likes: 18,
    comments: 3,
    tags: ['health', 'meditation', 'yoga', 'energy'],
    createdAt: '2024-12-12T07:15:00Z',
    manifestationMethod: 'Affirmations'
  },
  {
    id: '3',
    title: 'House Hunting Manifestation',
    content: 'I spent the day visualizing my perfect home by the ocean. I can see every detail - the large windows with natural light streaming in, the sound of waves in the background, the garden where I\'ll grow my own herbs. I even wrote down the exact address I want to live on. I know it\'s coming to me at the perfect time.',
    mood: 'Hopeful',
    isPublic: false,
    likes: 0,
    comments: 0,
    tags: ['home', 'visualization', 'ocean', 'manifestation'],
    createdAt: '2024-12-10T19:45:00Z',
    manifestationMethod: 'Scripting'
  }
];

export const mockAffirmations = [
  {
    id: '1',
    text: 'I am worthy of all the abundance life has to offer',
    category: 'Self-Worth',
    frequency: 'daily',
    isActive: true,
    createdAt: '2024-11-01'
  },
  {
    id: '2',
    text: 'My business grows with ease and brings value to others',
    category: 'Career',
    frequency: 'daily',
    isActive: true,
    createdAt: '2024-11-01'
  },
  {
    id: '3',
    text: 'Perfect health flows through every cell of my body',
    category: 'Health',
    frequency: 'morning',
    isActive: true,
    createdAt: '2024-10-15'
  },
  {
    id: '4',
    text: 'I attract loving, supportive relationships into my life',
    category: 'Relationships',
    frequency: 'weekly',
    isActive: false,
    createdAt: '2024-09-20'
  }
];

export const mockHabits = [
  {
    id: '1',
    name: 'Morning Meditation',
    description: '20 minutes of mindfulness meditation',
    category: 'Spiritual',
    frequency: 'daily',
    streak: 21,
    completedDates: [
      '2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05',
      '2024-12-06', '2024-12-07', '2024-12-08', '2024-12-09', '2024-12-10',
      '2024-12-11', '2024-12-12', '2024-12-13', '2024-12-14', '2024-12-15'
    ],
    target: 365,
    progress: 85
  },
  {
    id: '2',
    name: 'Gratitude Journaling',
    description: 'Write 3 things I\'m grateful for',
    category: 'Mindfulness',
    frequency: 'daily',
    streak: 18,
    completedDates: [
      '2024-12-01', '2024-12-02', '2024-12-04', '2024-12-05',
      '2024-12-07', '2024-12-08', '2024-12-09', '2024-12-11',
      '2024-12-12', '2024-12-13', '2024-12-14', '2024-12-15'
    ],
    target: 365,
    progress: 78
  },
  {
    id: '3',
    name: 'Vision Board Review',
    description: 'Spend 10 minutes visualizing my goals',
    category: 'Manifestation',
    frequency: 'weekly',
    streak: 8,
    completedDates: ['2024-11-03', '2024-11-10', '2024-11-17', '2024-11-24', '2024-12-01', '2024-12-08', '2024-12-15'],
    target: 52,
    progress: 65
  }
];

export const mockGratitudeEntries = [
  {
    id: '1',
    title: 'Perfect Timing',
    entries: [
      'The unexpected opportunity that came my way today',
      'My body\'s incredible ability to heal and regenerate',
      'The sunset that painted the sky in the most beautiful colors'
    ],
    mood: 'Peaceful',
    createdAt: '2024-12-15T21:00:00Z',
    image: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Simple Joys',
    entries: [
      'The perfect cup of coffee that started my day right',
      'My cat\'s purring while sitting on my lap',
      'The encouraging text from my best friend'
    ],
    mood: 'Content',
    createdAt: '2024-12-14T20:30:00Z'
  },
  {
    id: '3',
    title: 'Growth & Learning',
    entries: [
      'The challenging situation that taught me resilience',
      'My mentor\'s wise advice that shifted my perspective',
      'The progress I\'ve made in my meditation practice'
    ],
    mood: 'Inspired',
    createdAt: '2024-12-13T19:15:00Z'
  }
];

export const mockTemplates = [
  {
    id: '1',
    name: '5x55 Manifestation Method',
    description: 'Write your affirmation 55 times for 5 consecutive days',
    category: 'Manifestation',
    duration: '5 days',
    difficulty: 'Beginner',
    steps: [
      'Choose a specific affirmation that resonates with your goal',
      'Write it in present tense as if it\'s already happening',
      'Write the affirmation 55 times each day',
      'Focus on the feeling of already having what you want',
      'Continue for 5 consecutive days without skipping'
    ],
    example: 'I am successfully running my thriving online business',
    tips: [
      'Use the same affirmation for all 5 days',
      'Write by hand for better connection',
      'Feel the emotions as you write',
      'Don\'t rush - quality over speed'
    ]
  },
  {
    id: '2',
    name: 'Scripting Manifestation',
    description: 'Write detailed stories about your desired future as if it\'s already happened',
    category: 'Manifestation',
    duration: 'Ongoing',
    difficulty: 'Intermediate',
    steps: [
      'Set a clear intention for what you want to manifest',
      'Write in past tense as if it already happened',
      'Include specific details and emotions',
      'Focus on how you feel in your desired reality',
      'Read your script regularly to reinforce the vision'
    ],
    example: 'I am so grateful that I successfully launched my dream business last month...',
    tips: [
      'Be as specific as possible',
      'Include all your senses in the description',
      'Write about the journey, not just the outcome',
      'Feel genuine gratitude as you write'
    ]
  },
  {
    id: '3',
    name: '369 Manifestation Method',
    description: 'Write your intention 3 times in the morning, 6 times in the afternoon, and 9 times at night',
    category: 'Manifestation',
    duration: '21 days',
    difficulty: 'Beginner',
    steps: [
      'Choose your manifestation intention',
      'Write it 3 times every morning',
      'Write it 6 times every afternoon',
      'Write it 9 times every night',
      'Continue for 21 days consistently'
    ],
    example: 'I am living in my perfect home by the ocean',
    tips: [
      'Set reminders for each writing session',
      'Use the same wording each time',
      'Visualize while writing',
      'Trust the process even if you don\'t see immediate results'
    ]
  }
];

export const mockCommunityPosts = [
  {
    id: '1',
    author: {
      name: 'Emma Thompson',
      avatar: '/api/placeholder/50/50',
      level: 'Manifestation Master'
    },
    title: 'Manifested My Dream Job in 30 Days! 🎉',
    content: 'I can\'t believe it worked so fast! After using the 5x55 method and daily visualization, I got offered my dream position at a company I\'ve admired for years. The key was really believing it was already mine.',
    likes: 127,
    comments: 18,
    shares: 9,
    timeAgo: '2 hours ago',
    tags: ['success-story', 'career', '5x55-method'],
    images: ['/api/placeholder/400/300']
  },
  {
    id: '2',
    author: {
      name: 'Michael Chen',
      avatar: '/api/placeholder/50/50',
      level: 'Rising Star'
    },
    title: 'Gratitude Practice Changed Everything',
    content: 'Started my gratitude practice 3 months ago and my entire outlook on life has shifted. I\'m attracting so much more positivity and abundance. Small changes, big results!',
    likes: 89,
    comments: 12,
    shares: 5,
    timeAgo: '5 hours ago',
    tags: ['gratitude', 'mindset', 'personal-growth']
  },
  {
    id: '3',
    author: {
      name: 'Luna Rodriguez',
      avatar: '/api/placeholder/50/50',
      level: 'Vision Keeper'
    },
    title: 'My Vision Board Came to Life',
    content: 'Created a vision board 6 months ago with images of traveling to Bali, and guess what? I\'m posting this from a beautiful cafe in Ubud! Sometimes the universe works in the most magical ways. ✨',
    likes: 203,
    comments: 31,
    shares: 15,
    timeAgo: '1 day ago',
    tags: ['vision-board', 'travel', 'manifestation'],
    images: ['/api/placeholder/400/250', '/api/placeholder/300/200']
  }
];

export const mockStats = {
  totalUsers: 15847,
  goalsAchieved: 4321,
  affirmationsCompleted: 89653,
  communityPosts: 2847,
  successStories: 1205
};