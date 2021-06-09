
import Quiz from './Quiz';
export default interface QuizResult {
    displayScore:boolean,

    submittedQuiz:Quiz,
    quiz:Quiz,
    correctAnswer: number, 
    wrongAnswer: number,
    totalQuestion: number,
    score: number,
    message: string
}