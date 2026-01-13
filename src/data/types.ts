export interface Question {
  questionHeading: string;
  questionLink?: string;
  gfgLink?: string;
  leetCodeLink?: string;
  youTubeLink?: string;
  isDone: boolean;
  isBookmarked: boolean;
  userNotes?: string;
  questionIndex: number;
  questionId: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  categoryTotalQuestions?: number;
  categoryCompletedQuestions?: number;
  questionList: Question[];
}

export interface Content {
  contentPath: string;
  contentHeading: string;
  contentSubHeading: string;
  contentUserNotes: string;
  contentTotalQuestions?: number;
  contentCompletedQuestions?: number;
  categoryList: Category[];
}

export interface MotivationalQuote {
  quote: string;
  author: string;
}

export interface Header {
  motivationalQuotes: MotivationalQuote[];
  darkMode: boolean;
  isBookmarkFilterRequired: boolean;
  totalQuestions?: number;
  completedQuestions?: number;
}

export interface Data {
  header: Header;
  content: Content[];
}

export interface UltimateData {
  data: Data;
}
