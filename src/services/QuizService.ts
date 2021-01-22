

import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises'; 
import Quiz from './../models/Quiz';
export default class QuizService {
    private static instance?: QuizService;

    static getInstance(): QuizService {
        if (this.instance == null) {
            this.instance = new QuizService();
        }
        return this.instance;
    }
    addQuiz = (quiz: Quiz) => {
        const endpoint = contextPath().concat("api/app/quiz/add")
        return commonAjaxPostCalls(endpoint, {quiz:quiz});
    }
    getQuiz = (id: number) => {
        const endpoint = contextPath().concat("api/app/quiz/getquiz/"+id)
        return commonAjaxPostCalls(endpoint, {});
    }

}