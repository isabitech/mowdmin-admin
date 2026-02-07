export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: BibleTranslation;
  categories: VerseCategory[];
  topics: string[];
  tags: string[];
  themes: VerseTheme[];
  context: VerseContext;
  commentary?: string;
  devotionalNote?: string;
  crossReferences: CrossReference[];
  memoryVerseLevel: MemoryLevel;
  featured: boolean;
  bookmarks: number;
  shares: number;
  downloads: number;
  collections: string[]; // IDs of collections this verse belongs to
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrossReference {
  book: string;
  chapter: number;
  verse: number;
  relationshipType: 'parallel' | 'contrast' | 'explanation' | 'prophecy' | 'fulfillment' | 'background';
  note?: string;
}

export interface VerseContext {
  audienceType: AudienceType;
  historicalPeriod: string;
  literaryGenre: LiteraryGenre;
  speaker?: string;
  occasion?: string;
  culturalBackground?: string;
}

export interface VerseCollection {
  id: string;
  name: string;
  description: string;
  category: CollectionCategory;
  verses: string[]; // verse IDs
  isPublic: boolean;
  featured: boolean;
  coverImageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type BibleTranslation = 
  | 'NIV' // New International Version
  | 'ESV' // English Standard Version
  | 'NASB' // New American Standard Bible
  | 'KJV' // King James Version
  | 'NKJV' // New King James Version
  | 'NLT' // New Living Translation
  | 'CSB' // Christian Standard Bible
  | 'MSG' // The Message
  | 'AMP' // Amplified Bible
  | 'RSV' // Revised Standard Version
  | 'HCSB' // Holman Christian Standard Bible
  | 'CEV'; // Contemporary English Version

export type VerseCategory = 
  | 'salvation'
  | 'faith'
  | 'hope'
  | 'love'
  | 'peace'
  | 'joy'
  | 'wisdom'
  | 'guidance'
  | 'comfort'
  | 'strength'
  | 'prayer'
  | 'worship'
  | 'forgiveness'
  | 'grace'
  | 'mercy'
  | 'truth'
  | 'righteousness'
  | 'holiness'
  | 'healing'
  | 'prosperity'
  | 'family'
  | 'marriage'
  | 'parenting'
  | 'friendship'
  | 'leadership'
  | 'service'
  | 'evangelism'
  | 'discipleship'
  | 'stewardship'
  | 'thanksgiving'
  | 'courage'
  | 'patience'
  | 'humility'
  | 'obedience'
  | 'trust'
  | 'fear_of_god'
  | 'eternal_life'
  | 'second_coming'
  | 'heaven'
  | 'hell'
  | 'angels'
  | 'creation'
  | 'prophecy'
  | 'miracles';

export type VerseTheme = 
  | 'gods_character'
  | 'jesus_christ'
  | 'holy_spirit'
  | 'trinity'
  | 'salvation_plan'
  | 'christian_living'
  | 'spiritual_growth'
  | 'biblical_promises'
  | 'end_times'
  | 'church_life'
  | 'relationships'
  | 'work_calling'
  | 'suffering_trials'
  | 'victory_overcoming'
  | 'biblical_commands'
  | 'worship_praise'
  | 'prayer_intercession'
  | 'evangelism_missions'
  | 'discipleship_mentoring'
  | 'stewardship_giving';

export type AudienceType = 
  | 'believers'
  | 'unbelievers'
  | 'disciples'
  | 'leaders'
  | 'church'
  | 'israel'
  | 'nations'
  | 'individuals'
  | 'families'
  | 'all_people';

export type LiteraryGenre = 
  | 'narrative'
  | 'poetry'
  | 'wisdom'
  | 'prophecy'
  | 'gospel'
  | 'epistle'
  | 'apocalyptic'
  | 'parable'
  | 'law'
  | 'historical';

export type MemoryLevel = 
  | 'beginner' // Easy to memorize, shorter verses
  | 'intermediate' // Moderate length and complexity
  | 'advanced' // Longer or more complex verses
  | 'master'; // Very challenging verses

export type CollectionCategory = 
  | 'devotional'
  | 'study'
  | 'memory'
  | 'topical'
  | 'seasonal'
  | 'age_specific'
  | 'ministry'
  | 'personal'
  | 'church';

// Filter interfaces
export interface BibleVerseFilters {
  search?: string;
  book?: string[];
  translation?: BibleTranslation[];
  categories?: VerseCategory[];
  themes?: VerseTheme[];
  topics?: string[];
  tags?: string[];
  memoryLevel?: MemoryLevel[];
  featured?: boolean;
  hasCommentary?: boolean;
  hasDevotional?: boolean;
  hasCrossReferences?: boolean;
  audienceType?: AudienceType[];
  literaryGenre?: LiteraryGenre[];
  minBookmarks?: number;
  maxBookmarks?: number;
  collection?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

// API request/response interfaces
export interface CreateBibleVerseData {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: BibleTranslation;
  categories: VerseCategory[];
  topics: string[];
  tags: string[];
  themes: VerseTheme[];
  context: VerseContext;
  commentary?: string;
  devotionalNote?: string;
  crossReferences?: CrossReference[];
  memoryVerseLevel: MemoryLevel;
  featured?: boolean;
  collections?: string[];
}

export interface UpdateBibleVerseData extends Partial<CreateBibleVerseData> {}

export interface CreateVerseCollectionData {
  name: string;
  description: string;
  category: CollectionCategory;
  verses: string[];
  isPublic: boolean;
  featured?: boolean;
  coverImageUrl?: string;
}

export interface UpdateVerseCollectionData extends Partial<CreateVerseCollectionData> {}

export interface BibleVerseStats {
  totalVerses: number;
  versesByTranslation: Record<BibleTranslation, number>;
  versesByCategory: Record<VerseCategory, number>;
  versesByTheme: Record<VerseTheme, number>;
  versesByMemoryLevel: Record<MemoryLevel, number>;
  totalBookmarks: number;
  totalShares: number;
  totalDownloads: number;
  totalCollections: number;
  featuredVerses: number;
  popularVerses: BibleVerse[];
  recentVerses: BibleVerse[];
  topCollections: VerseCollection[];
}

export interface BibleVerseAnalytics {
  verseEngagement: { verse: BibleVerse; bookmarks: number; shares: number; downloads: number }[];
  categoryPopularity: { category: VerseCategory; count: number; percentage: number }[];
  translationUsage: { translation: BibleTranslation; count: number; percentage: number }[];
  memoryVerseProgress: { level: MemoryLevel; completed: number; total: number }[];
  collectionGrowth: { date: string; collections: number }[];
  userEngagement: { date: string; bookmarks: number; shares: number; downloads: number }[];
}

// Configuration objects
export const BIBLE_TRANSLATIONS: Record<BibleTranslation, { name: string; abbreviation: string; description: string; year: number }> = {
  NIV: { name: 'New International Version', abbreviation: 'NIV', description: 'Modern, accurate, and clear translation', year: 1978 },
  ESV: { name: 'English Standard Version', abbreviation: 'ESV', description: 'Literal yet readable translation', year: 2001 },
  NASB: { name: 'New American Standard Bible', abbreviation: 'NASB', description: 'Highly literal and precise translation', year: 1971 },
  KJV: { name: 'King James Version', abbreviation: 'KJV', description: 'Classic English translation', year: 1611 },
  NKJV: { name: 'New King James Version', abbreviation: 'NKJV', description: 'Updated King James language', year: 1982 },
  NLT: { name: 'New Living Translation', abbreviation: 'NLT', description: 'Thought-for-thought translation', year: 1996 },
  CSB: { name: 'Christian Standard Bible', abbreviation: 'CSB', description: 'Balance of accuracy and clarity', year: 2017 },
  MSG: { name: 'The Message', abbreviation: 'MSG', description: 'Contemporary paraphrase', year: 2002 },
  AMP: { name: 'Amplified Bible', abbreviation: 'AMP', description: 'Expanded meaning and context', year: 1965 },
  RSV: { name: 'Revised Standard Version', abbreviation: 'RSV', description: 'Scholarly revision of ASV', year: 1952 },
  HCSB: { name: 'Holman Christian Standard Bible', abbreviation: 'HCSB', description: 'Optimal equivalence translation', year: 2004 },
  CEV: { name: 'Contemporary English Version', abbreviation: 'CEV', description: 'Simple, natural English', year: 1995 },
};

export const VERSE_CATEGORIES: Record<VerseCategory, { name: string; icon: string; color: string; description: string }> = {
  salvation: { name: 'Salvation', icon: '✝️', color: 'red', description: 'Verses about salvation and redemption' },
  faith: { name: 'Faith', icon: '🙏', color: 'blue', description: 'Verses about faith and believing' },
  hope: { name: 'Hope', icon: '🌅', color: 'yellow', description: 'Verses about hope and expectation' },
  love: { name: 'Love', icon: '❤️', color: 'pink', description: 'Verses about love and compassion' },
  peace: { name: 'Peace', icon: '🕊️', color: 'green', description: 'Verses about peace and tranquility' },
  joy: { name: 'Joy', icon: '😊', color: 'orange', description: 'Verses about joy and happiness' },
  wisdom: { name: 'Wisdom', icon: '🦉', color: 'purple', description: 'Verses about wisdom and understanding' },
  guidance: { name: 'Guidance', icon: '🧭', color: 'indigo', description: 'Verses about direction and guidance' },
  comfort: { name: 'Comfort', icon: '🤗', color: 'teal', description: 'Verses about comfort and consolation' },
  strength: { name: 'Strength', icon: '💪', color: 'red', description: 'Verses about strength and power' },
  prayer: { name: 'Prayer', icon: '🙏', color: 'blue', description: 'Verses about prayer and communion' },
  worship: { name: 'Worship', icon: '🎵', color: 'purple', description: 'Verses about worship and praise' },
  forgiveness: { name: 'Forgiveness', icon: '🤝', color: 'green', description: 'Verses about forgiveness and mercy' },
  grace: { name: 'Grace', icon: '✨', color: 'gold', description: 'Verses about grace and favor' },
  mercy: { name: 'Mercy', icon: '💝', color: 'pink', description: 'Verses about mercy and compassion' },
  truth: { name: 'Truth', icon: '🔍', color: 'blue', description: 'Verses about truth and honesty' },
  righteousness: { name: 'Righteousness', icon: '⚖️', color: 'indigo', description: 'Verses about righteousness and justice' },
  holiness: { name: 'Holiness', icon: '👑', color: 'gold', description: 'Verses about holiness and sanctification' },
  healing: { name: 'Healing', icon: '🩺', color: 'green', description: 'Verses about healing and restoration' },
  prosperity: { name: 'Prosperity', icon: '🌾', color: 'yellow', description: 'Verses about prosperity and blessing' },
  family: { name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'orange', description: 'Verses about family relationships' },
  marriage: { name: 'Marriage', icon: '💑', color: 'pink', description: 'Verses about marriage and spouses' },
  parenting: { name: 'Parenting', icon: '👶', color: 'teal', description: 'Verses about parenting and children' },
  friendship: { name: 'Friendship', icon: '👫', color: 'blue', description: 'Verses about friendship and relationships' },
  leadership: { name: 'Leadership', icon: '👑', color: 'purple', description: 'Verses about leadership and authority' },
  service: { name: 'Service', icon: '🤲', color: 'green', description: 'Verses about service and ministry' },
  evangelism: { name: 'Evangelism', icon: '📢', color: 'red', description: 'Verses about evangelism and witnessing' },
  discipleship: { name: 'Discipleship', icon: '🎯', color: 'blue', description: 'Verses about discipleship and following' },
  stewardship: { name: 'Stewardship', icon: '💰', color: 'green', description: 'Verses about stewardship and giving' },
  thanksgiving: { name: 'Thanksgiving', icon: '🙏', color: 'orange', description: 'Verses about thanksgiving and gratitude' },
  courage: { name: 'Courage', icon: '🦁', color: 'red', description: 'Verses about courage and bravery' },
  patience: { name: 'Patience', icon: '⏰', color: 'blue', description: 'Verses about patience and endurance' },
  humility: { name: 'Humility', icon: '🙇', color: 'gray', description: 'Verses about humility and meekness' },
  obedience: { name: 'Obedience', icon: '✅', color: 'green', description: 'Verses about obedience and submission' },
  trust: { name: 'Trust', icon: '🤲', color: 'blue', description: 'Verses about trust and reliance' },
  fear_of_god: { name: 'Fear of God', icon: '😇', color: 'purple', description: 'Verses about reverence and awe' },
  eternal_life: { name: 'Eternal Life', icon: '♾️', color: 'gold', description: 'Verses about eternal life and heaven' },
  second_coming: { name: 'Second Coming', icon: '☁️', color: 'blue', description: 'Verses about Christ\'s return' },
  heaven: { name: 'Heaven', icon: '🌤️', color: 'gold', description: 'Verses about heaven and glory' },
  hell: { name: 'Hell', icon: '🔥', color: 'red', description: 'Verses about hell and judgment' },
  angels: { name: 'Angels', icon: '👼', color: 'white', description: 'Verses about angels and heavenly beings' },
  creation: { name: 'Creation', icon: '🌍', color: 'green', description: 'Verses about creation and nature' },
  prophecy: { name: 'Prophecy', icon: '🔮', color: 'purple', description: 'Verses about prophecy and future' },
  miracles: { name: 'Miracles', icon: '⭐', color: 'yellow', description: 'Verses about miracles and signs' },
};

export const VERSE_THEMES: Record<VerseTheme, { name: string; description: string; color: string }> = {
  gods_character: { name: 'God\'s Character', description: 'Attributes and nature of God', color: 'gold' },
  jesus_christ: { name: 'Jesus Christ', description: 'Person and work of Christ', color: 'red' },
  holy_spirit: { name: 'Holy Spirit', description: 'Person and work of the Spirit', color: 'blue' },
  trinity: { name: 'Trinity', description: 'Three persons of the Godhead', color: 'purple' },
  salvation_plan: { name: 'Salvation Plan', description: 'God\'s plan of salvation', color: 'green' },
  christian_living: { name: 'Christian Living', description: 'How to live as a Christian', color: 'teal' },
  spiritual_growth: { name: 'Spiritual Growth', description: 'Growing in faith and maturity', color: 'indigo' },
  biblical_promises: { name: 'Biblical Promises', description: 'God\'s promises to believers', color: 'yellow' },
  end_times: { name: 'End Times', description: 'Eschatology and last days', color: 'orange' },
  church_life: { name: 'Church Life', description: 'Community and fellowship', color: 'pink' },
  relationships: { name: 'Relationships', description: 'Human relationships and love', color: 'rose' },
  work_calling: { name: 'Work & Calling', description: 'Purpose and vocation', color: 'amber' },
  suffering_trials: { name: 'Suffering & Trials', description: 'Dealing with hardships', color: 'gray' },
  victory_overcoming: { name: 'Victory & Overcoming', description: 'Triumph and conquest', color: 'emerald' },
  biblical_commands: { name: 'Biblical Commands', description: 'God\'s commandments and laws', color: 'slate' },
  worship_praise: { name: 'Worship & Praise', description: 'Glorifying and honoring God', color: 'violet' },
  prayer_intercession: { name: 'Prayer & Intercession', description: 'Communication with God', color: 'cyan' },
  evangelism_missions: { name: 'Evangelism & Missions', description: 'Sharing the gospel', color: 'red' },
  discipleship_mentoring: { name: 'Discipleship & Mentoring', description: 'Making and growing disciples', color: 'blue' },
  stewardship_giving: { name: 'Stewardship & Giving', description: 'Managing resources faithfully', color: 'green' },
};

export const MEMORY_LEVELS: Record<MemoryLevel, { name: string; description: string; color: string; maxLength: number }> = {
  beginner: { name: 'Beginner', description: 'Short, easy verses perfect for new memorizers', color: 'green', maxLength: 50 },
  intermediate: { name: 'Intermediate', description: 'Moderate verses for developing memorizers', color: 'yellow', maxLength: 100 },
  advanced: { name: 'Advanced', description: 'Longer verses for experienced memorizers', color: 'orange', maxLength: 200 },
  master: { name: 'Master', description: 'Complex verses for memory champions', color: 'red', maxLength: 999 },
};

export const COLLECTION_CATEGORIES: Record<CollectionCategory, { name: string; icon: string; description: string }> = {
  devotional: { name: 'Devotional', icon: '📖', description: 'Collections for daily devotions' },
  study: { name: 'Study', icon: '🔍', description: 'Collections for Bible study' },
  memory: { name: 'Memory', icon: '🧠', description: 'Collections for memorization' },
  topical: { name: 'Topical', icon: '📋', description: 'Collections organized by topic' },
  seasonal: { name: 'Seasonal', icon: '🗓️', description: 'Collections for special seasons' },
  age_specific: { name: 'Age Specific', icon: '👨‍👩‍👧‍👦', description: 'Collections for specific age groups' },
  ministry: { name: 'Ministry', icon: '⛪', description: 'Collections for ministry use' },
  personal: { name: 'Personal', icon: '👤', description: 'Personal verse collections' },
  church: { name: 'Church', icon: '🏛️', description: 'Collections for church use' },
};

// Popular topics for quick access
export const POPULAR_TOPICS = [
  'anxiety', 'depression', 'fear', 'worry', 'stress', 'loneliness', 'grief',
  'money', 'work', 'relationships', 'marriage', 'parenting', 'children',
  'healing', 'sickness', 'death', 'resurrection', 'eternal life',
  'worship', 'praise', 'thanksgiving', 'prayer', 'fasting',
  'christmas', 'easter', 'thanksgiving', 'new year', 'graduation',
  'baptism', 'communion', 'church', 'ministry', 'missions',
  'bible study', 'discipleship', 'evangelism', 'witnessing'
];

// Popular tags for organizing verses
export const POPULAR_TAGS = [
  'encouragement', 'comfort', 'strength', 'peace', 'joy', 'love',
  'faith', 'hope', 'trust', 'guidance', 'protection', 'provision',
  'healing', 'forgiveness', 'grace', 'mercy', 'salvation', 'eternal',
  'worship', 'praise', 'prayer', 'blessing', 'promise', 'truth',
  'wisdom', 'knowledge', 'understanding', 'righteousness', 'holiness'
];