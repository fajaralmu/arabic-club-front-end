import Quiz from './Quiz';
import BaseEntity from './BaseEntity';
import QuizChoice from './QuizChoice';

export default class QuizQuestion extends BaseEntity {
	static public_choices: Array<string> = ["A", "B", "C", "D"];
	answerCode?: string;
	correctChoice?: string;
	statement?: string;
	answerEssay?:string;
	essay?:boolean;

	quiz?: Quiz;
	image?: undefined|string;
	choices?: QuizChoice[];
	duration:number = 5;
	number:number = 1;

	
	entered:boolean = false;
	static answer = (question:QuizQuestion) => {
		return question.essay == true? question.answerEssay : question.answerCode;
	}
	static publicQuizQuestion = (essay:boolean = false): QuizQuestion => {
		const question: QuizQuestion = new QuizQuestion();
		
		const choices: QuizChoice[] = [];
		if (essay == false) {
			question.answerCode = "A";
			for (let i = 0; i < QuizQuestion.public_choices.length; i++) {
				const code = QuizQuestion.public_choices[i];
				choices.push({ answerCode: code, statement:"Answer "+ code});

			}
		} else {
			question.answerEssay = "ANSWER ESSAY";
		}
		question.essay = essay
		question.choices = choices;
		return question;
	}
}
