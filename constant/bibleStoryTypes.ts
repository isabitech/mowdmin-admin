export interface BibleStory {
  id: string;
  title: string;
  summary: string;
  content: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  category: BibleStoryCategory;
  tags: string[];
  ageGroups: AgeGroup[];
  difficulty: DifficultyLevel;
  lessonPoints: string[];
  moralLesson: string;
  questions: BibleStoryQuestion[];
  activities: BibleStoryActivity[];
  relatedStories: string[];
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  downloadable: boolean;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BibleStoryQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended' | 'fill-blank';
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty: DifficultyLevel;
}

export interface BibleStoryActivity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  materials: string[];
  duration: number; // in minutes
  instructions: string[];
  ageGroups: AgeGroup[];
}

export type BibleStoryCategory = 
  | 'old_testament'
  | 'new_testament'
  | 'creation'
  | 'patriarchs'
  | 'exodus'
  | 'judges'
  | 'kings'
  | 'prophets'
  | 'psalms_wisdom'
  | 'gospels'
  | 'acts'
  | 'epistles'
  | 'revelation'
  | 'parables'
  | 'miracles'
  | 'christmas'
  | 'easter'
  | 'heroes_faith'
  | 'love_compassion'
  | 'courage_bravery'
  | 'forgiveness'
  | 'obedience'
  | 'prayer'
  | 'worship';

export type AgeGroup = 
  | 'toddlers' // 2-3 years
  | 'preschool' // 4-5 years
  | 'elementary' // 6-10 years
  | 'preteens' // 11-12 years
  | 'teens' // 13-17 years
  | 'adults' // 18+ years
  | 'all_ages';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type ActivityType = 
  | 'coloring'
  | 'craft'
  | 'game'
  | 'puzzle'
  | 'drama'
  | 'song'
  | 'discussion'
  | 'writing'
  | 'drawing'
  | 'memory_verse'
  | 'roleplay'
  | 'storytelling';

// Filter interfaces
export interface BibleStoryFilters {
  search?: string;
  category?: BibleStoryCategory[];
  ageGroups?: AgeGroup[];
  difficulty?: DifficultyLevel[];
  status?: string[];
  book?: string[];
  tags?: string[];
  featured?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  hasActivities?: boolean;
  minViews?: number;
  maxViews?: number;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

// API request/response interfaces
export interface CreateBibleStoryData {
  title: string;
  summary: string;
  content: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  category: BibleStoryCategory;
  tags: string[];
  ageGroups: AgeGroup[];
  difficulty: DifficultyLevel;
  lessonPoints: string[];
  moralLesson: string;
  questions?: BibleStoryQuestion[];
  activities?: BibleStoryActivity[];
  relatedStories?: string[];
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  downloadable?: boolean;
  featured?: boolean;
  status: 'draft' | 'published' | 'archived';
}

export interface UpdateBibleStoryData extends Partial<CreateBibleStoryData> {}

export interface BibleStoryStats {
  totalStories: number;
  publishedStories: number;
  draftStories: number;
  archivedStories: number;
  totalViews: number;
  totalLikes: number;
  averageRating: number;
  storiesByCategory: Record<BibleStoryCategory, number>;
  storiesByAgeGroup: Record<AgeGroup, number>;
  storiesByDifficulty: Record<DifficultyLevel, number>;
  popularStories: BibleStory[];
  recentStories: BibleStory[];
}

export interface BibleStoryAnalytics {
  viewsOverTime: { date: string; views: number }[];
  likesOverTime: { date: string; likes: number }[];
  categoryPopularity: { category: BibleStoryCategory; count: number; percentage: number }[];
  ageGroupEngagement: { ageGroup: AgeGroup; engagement: number }[];
  topStories: { story: BibleStory; metrics: { views: number; likes: number; rating: number } }[];
}

// Configuration objects
export const BIBLE_STORY_CATEGORIES: Record<BibleStoryCategory, { name: string; icon: string; color: string; description: string }> = {
  old_testament: { name: 'Old Testament', icon: '📜', color: 'amber', description: 'Stories from the Hebrew Bible' },
  new_testament: { name: 'New Testament', icon: '✝️', color: 'blue', description: 'Stories from the Christian New Testament' },
  creation: { name: 'Creation', icon: '🌍', color: 'green', description: 'Creation stories and early history' },
  patriarchs: { name: 'Patriarchs', icon: '👨‍🦳', color: 'purple', description: 'Stories of Abraham, Isaac, Jacob, and Joseph' },
  exodus: { name: 'Exodus', icon: '🏜️', color: 'orange', description: 'Moses and the journey from Egypt' },
  judges: { name: 'Judges', icon: '⚖️', color: 'indigo', description: 'Stories of Israelite judges and leaders' },
  kings: { name: 'Kings', icon: '👑', color: 'yellow', description: 'Stories of kings David, Solomon, and others' },
  prophets: { name: 'Prophets', icon: '🗣️', color: 'red', description: 'Messages and stories of the prophets' },
  psalms_wisdom: { name: 'Psalms & Wisdom', icon: '💭', color: 'teal', description: 'Wisdom literature and psalms' },
  gospels: { name: 'Gospels', icon: '✨', color: 'pink', description: 'Life and teachings of Jesus' },
  acts: { name: 'Acts', icon: '🔥', color: 'cyan', description: 'Early church history' },
  epistles: { name: 'Epistles', icon: '💌', color: 'lime', description: 'Letters to early churches' },
  revelation: { name: 'Revelation', icon: '🌅', color: 'rose', description: 'Prophetic visions and end times' },
  parables: { name: 'Parables', icon: '📖', color: 'emerald', description: 'Teaching stories told by Jesus' },
  miracles: { name: 'Miracles', icon: '⭐', color: 'violet', description: 'Miraculous events and healings' },
  christmas: { name: 'Christmas', icon: '🎄', color: 'red', description: 'Birth and nativity stories' },
  easter: { name: 'Easter', icon: '🌸', color: 'pink', description: 'Death and resurrection stories' },
  heroes_faith: { name: 'Heroes of Faith', icon: '🦸', color: 'blue', description: 'Stories of faithful individuals' },
  love_compassion: { name: 'Love & Compassion', icon: '❤️', color: 'red', description: 'Stories about love and kindness' },
  courage_bravery: { name: 'Courage & Bravery', icon: '🛡️', color: 'orange', description: 'Stories of courage and bravery' },
  forgiveness: { name: 'Forgiveness', icon: '🤝', color: 'green', description: 'Stories about forgiveness and mercy' },
  obedience: { name: 'Obedience', icon: '🎯', color: 'purple', description: 'Stories about following God\'s commands' },
  prayer: { name: 'Prayer', icon: '🙏', color: 'indigo', description: 'Stories about prayer and faith' },
  worship: { name: 'Worship', icon: '🎵', color: 'yellow', description: 'Stories about worship and praise' },
};

export const AGE_GROUPS: Record<AgeGroup, { name: string; description: string; minAge: number; maxAge?: number }> = {
  toddlers: { name: 'Toddlers', description: '2-3 years old', minAge: 2, maxAge: 3 },
  preschool: { name: 'Preschool', description: '4-5 years old', minAge: 4, maxAge: 5 },
  elementary: { name: 'Elementary', description: '6-10 years old', minAge: 6, maxAge: 10 },
  preteens: { name: 'Preteens', description: '11-12 years old', minAge: 11, maxAge: 12 },
  teens: { name: 'Teens', description: '13-17 years old', minAge: 13, maxAge: 17 },
  adults: { name: 'Adults', description: '18+ years old', minAge: 18 },
  all_ages: { name: 'All Ages', description: 'Suitable for all age groups', minAge: 0 },
};

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, { name: string; description: string; color: string }> = {
  beginner: { name: 'Beginner', description: 'Simple stories for new learners', color: 'green' },
  intermediate: { name: 'Intermediate', description: 'Moderate complexity stories', color: 'yellow' },
  advanced: { name: 'Advanced', description: 'Complex stories for mature learners', color: 'red' },
};

export const ACTIVITY_TYPES: Record<ActivityType, { name: string; icon: string; description: string }> = {
  coloring: { name: 'Coloring', icon: '🎨', description: 'Coloring pages and art activities' },
  craft: { name: 'Craft', icon: '✂️', description: 'Hands-on craft projects' },
  game: { name: 'Game', icon: '🎲', description: 'Educational games and activities' },
  puzzle: { name: 'Puzzle', icon: '🧩', description: 'Puzzles and brain teasers' },
  drama: { name: 'Drama', icon: '🎭', description: 'Dramatic performances and skits' },
  song: { name: 'Song', icon: '🎵', description: 'Songs and musical activities' },
  discussion: { name: 'Discussion', icon: '💬', description: 'Group discussions and sharing' },
  writing: { name: 'Writing', icon: '✍️', description: 'Writing exercises and journaling' },
  drawing: { name: 'Drawing', icon: '✏️', description: 'Drawing and illustration activities' },
  memory_verse: { name: 'Memory Verse', icon: '🧠', description: 'Scripture memorization activities' },
  roleplay: { name: 'Role Play', icon: '👥', description: 'Acting out stories and scenarios' },
  storytelling: { name: 'Storytelling', icon: '📚', description: 'Interactive storytelling activities' },
};

// Bible books list
export const BIBLE_BOOKS = [
  // Old Testament
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  // New Testament
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
  '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

export const POPULAR_TAGS = [
  'children', 'youth', 'family', 'lessons', 'morals', 'faith', 'courage',
  'love', 'forgiveness', 'obedience', 'prayer', 'worship', 'miracles',
  'parables', 'heroes', 'christmas', 'easter', 'creation', 'salvation',
  'discipleship', 'evangelism', 'stewardship', 'community', 'service'
];