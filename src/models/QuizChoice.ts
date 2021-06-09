import BaseEntity from './BaseEntity';
import QuizQuestion from './QuizQuestion';

export default class QuizChoice extends BaseEntity{
	answerCode?:string;
	statement?:string;
	image?:undefined|string;
	question?:QuizQuestion;

}
