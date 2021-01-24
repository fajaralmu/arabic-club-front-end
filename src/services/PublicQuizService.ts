

import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises'; 
import WebRequest from './../models/WebRequest';
import Filter from './../models/Filter';
import Quiz from './../models/Quiz';
export default class PublicQuizService {
    private static instance?: PublicQuizService;

    static getInstance(): PublicQuizService {
        if (this.instance == null) {
            this.instance = new PublicQuizService();
        }
        return this.instance;
    }
    
    getQuiz = (id: number) => {
        const endpoint = contextPath().concat("api/public/quiz/get/"+id)
        return commonAjaxPostCalls(endpoint, {});
    }
    submitAnswers = (quiz:Quiz) => {
        const endpoint = contextPath().concat("api/public/quiz/submit")
        return commonAjaxPostCalls(endpoint, {quiz:quiz});
    }
    getQuizList = (filter:Filter) => {
        const request:WebRequest = {filter:filter};
        const endpoint = contextPath().concat("api/public/quiz/list/")
        return commonAjaxPostCalls(endpoint, request);
    }

}