import BaseEntity from './BaseEntity';
import QuizQuestion from './QuizQuestion';

export default class Quiz extends BaseEntity{
    static clone= (quiz: Quiz):Quiz => {
        return  Object.assign(new Quiz(), quiz);
    }
	title?:string = "";
	description?:string = "";
	
	available?:boolean = true;
	showAllQuestion:boolean = true;
	questionsTimered:boolean = false;
	
	duration:number = 0;
	active?:boolean = true;
	repeatable?:boolean = true;
	protectedByCode?:boolean;
	
	questions:QuizQuestion[] = [];
	
	image?:string = "";
	startedDate?:Date |undefined= new Date();
	submittedDate?:Date = new Date();
	mappedAnswer?:{}; 
	//
	maxQuestionNumber?:number;

	public static updateMappedAnswer = (quiz:Quiz) => {
		quiz.mappedAnswer = {};
		for (let i = 0; i < quiz.questions.length; i++) {
			const element = quiz.questions[i];
			if (element.id &&(element.answerCode|| element.answerEssay || element.entered == true)) {
				quiz.mappedAnswer[new String(element.number).toString()] = element.answerCode??(element.answerEssay??null);
				 
			}
		}
		// console.debug("quiz.mappedAnswer: ", quiz.mappedAnswer);
	}
	getQuestionCount = () : number => {
		return this.questions?this.questions.length : 0;
	}

	resetCorrectChoices = () : void => {
		if (!this.questions || this.getQuestionCount() == 0) return;
		for (let i = 0; i < this.questions.length; i++) {
			const element = this.questions[i];
			element.correctChoice = undefined;
			element.answerCode = undefined;
		}
	}

	allQuestionHasBeenAnswered = () : boolean => {
		if (!this.questions || this.getQuestionCount() == 0) return false;

		for (let i = 0; i < this.questions.length; i++) {
			const element = this.questions[i];
			if (element.answerCode  == null) {
				return false;
			}
		}
		return true;
	}
	accessCode?: string ;
	afterCompletionMessage?:string;
}
