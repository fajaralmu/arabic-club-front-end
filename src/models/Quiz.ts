import BaseEntity from './BaseEntity';
import QuizQuestion from './QuizQuestion';

export default class Quiz extends BaseEntity{
	title?:string;
	description?:string;
	publicQuiz?:boolean;
	questions?:QuizQuestion[];

}
