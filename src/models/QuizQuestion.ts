import Quiz from './Quiz';
import BaseEntity from './BaseEntity';
import QuizChoice from './QuizChoice';

export default class QuizQuestion extends BaseEntity {
	static public_choices: Array<string> = ["A", "B", "C", "D"];
	answerCode?: string;
	correctChoice?: string;
	statement?: string;
	quiz?: Quiz;
	image?: string;
	choices?: QuizChoice[];
	duration:number = 5;
	number:number = 1;

	
	entered:boolean = false;

	static publicQuizQuestion = (): QuizQuestion => {
		const question: QuizQuestion = new QuizQuestion();
		question.answerCode = "A";
		const choices: QuizChoice[] = [];
		for (let i = 0; i < QuizQuestion.public_choices.length; i++) {
			const code = QuizQuestion.public_choices[i];
			choices.push({ answerCode: code, statement:"Answer "+ code});

		}

		question.choices = choices;
		return question;
	}
}
