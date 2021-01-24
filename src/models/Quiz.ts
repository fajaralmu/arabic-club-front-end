import BaseEntity from './BaseEntity';
import QuizQuestion from './QuizQuestion';

export default class Quiz extends BaseEntity{
	title?:string;
	description?:string;
	publicQuiz?:boolean;
	questions?:QuizQuestion[];

	questionCount = () : number => {
		return this.questions?this.questions.length : 0;
	}

	allQuestionHasBeenAnswered = () : boolean => {
		if (!this.questions || this.questionCount() == 0) return false;

		for (let i = 0; i < this.questions.length; i++) {
			const element = this.questions[i];
			if (element.answerCode  == null) {
				return false;
			}
		}
		return true;
	}
}
