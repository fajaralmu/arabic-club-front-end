

import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises'; 
import Quiz from './../models/Quiz';
import Filter from '../models/Filter';
export default class QuizService {
    getQuizList = (filter:Filter) => {
        const endpoint = contextPath().concat("api/app/quiz/list")
        return commonAjaxPostCalls(endpoint, {filter:filter});
    }
    private static instance?: QuizService;

    static getInstance(): QuizService {
        if (this.instance == null) {
            this.instance = new QuizService();
        }
        return this.instance;
    }
    submit = (quiz: Quiz) => {
        const endpoint = contextPath().concat("api/app/quiz/submit")
        return commonAjaxPostCalls(endpoint, {quiz:quiz});
    }
    getQuiz = (id: number) => {
        const endpoint = contextPath().concat("api/app/quiz/getquiz/"+id)
        return commonAjaxPostCalls(endpoint, {});
    }
    deleteQuiz = (id: number) => {
        const endpoint = contextPath().concat("api/app/quiz/deletequiz/"+id)
        return commonAjaxPostCalls(endpoint, {});
    }

}