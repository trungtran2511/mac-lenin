import { quizQuestions } from "./quizData.js";
import { generatedQuizQuestions } from "./generatedQuizQuestions.js";

export const allQuizQuestions = [...quizQuestions, ...generatedQuizQuestions];
