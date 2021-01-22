import BaseEntity from './BaseEntity';
import QuizQuestion from './QuizQuestion';

export default class Quiz extends BaseEntity{
	title?:string;
	description?:string;
	publicQuiz?:boolean;
	questions?:QuizQuestion[];

	questionCount = () => {
		return this.questions?this.questions.length : 0;
	}
}
