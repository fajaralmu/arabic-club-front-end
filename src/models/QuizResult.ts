
import Quiz from './Quiz';
export default class QuizResult {

    submittedQuiz?: Quiz;
    quiz?: Quiz;
    correctAnswer: number = 0;
    wrongAnswer: number = 0;
    totalQuestion: number = 0;
    score: number = 0;
}