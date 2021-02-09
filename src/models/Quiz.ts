import BaseEntity from './BaseEntity';
import QuizQuestion from './QuizQuestion';

export default class Quiz extends BaseEntity{
	title?:string = "";
	description?:string = "";
	publicQuiz?:boolean = true;
	questions?:QuizQuestion[] = [];
	duration:number = 0;
	active?:boolean = true

	questionCount = () : number => {
		return this.questions?this.questions.length : 0;
	}

	resetCorrectChoices = () : void => {
		if (!this.questions || this.questionCount() == 0) return;
		for (let i = 0; i < this.questions.length; i++) {
			const element = this.questions[i];
			element.correctChoice = undefined;
		}
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
