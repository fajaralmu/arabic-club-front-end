import UserModel from './User';
import BaseModel from './BaseEntity';
import QuizModel from './Quiz';

export default class QuizHistoryModel extends BaseModel{
	user?:UserModel;
	started?:Date;
	ended?:Date;
	quizDuration?:string;
	userDuration?:string;
	quiz?:QuizModel;
	quizRepeatable?:boolean;
	score?:number;
	created?:Date;
	updated?:Date;
	remainingDuration?:number;
	maxQuestionNumber?:number;
	requestId?:string;
	token?:string;
}
