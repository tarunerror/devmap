import type { UltimateData, Content, Category } from "@/data/types";

export function countQuestionsInCategory(category: Category): number {
  return category.questionList.length;
}

export function countQuestionsInContent(content: Content): number {
  return content.categoryList.reduce(
    (total, category) => total + countQuestionsInCategory(category),
    0,
  );
}

export function countAllQuestions(data: UltimateData): number {
  return data.data.content.reduce(
    (total, content) => total + countQuestionsInContent(content),
    0,
  );
}

export function getQuestionIdsFromContent(content: Content): string[] {
  return content.categoryList.flatMap((cat) =>
    cat.questionList.map((q) => q.questionId),
  );
}

export function getQuestionIdsFromCategory(category: Category): string[] {
  return category.questionList.map((q) => q.questionId);
}

export function getAllQuestionIds(data: UltimateData): string[] {
  return data.data.content.flatMap((content) =>
    content.categoryList.flatMap((cat) =>
      cat.questionList.map((q) => q.questionId),
    ),
  );
}
