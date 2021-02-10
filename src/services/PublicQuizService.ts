

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
        const endpoint = contextPath().concat("api/member/quiz/get/"+id)
        return commonAjaxPostCalls(endpoint, {});
    }
    submitAnswers = (quiz:Quiz) => {
        const endpoint = contextPath().concat("api/member/quiz/submit")
        return commonAjaxPostCalls(endpoint, {quiz:quiz});
    }
    getQuizList = (filter:Filter) => {
        const request:WebRequest = {filter:filter};
        const endpoint = contextPath().concat("api/member/quiz/list")
        return commonAjaxPostCalls(endpoint, request);
    }
    getHistories = (filter:Filter) => {
        const request:WebRequest = {filter:filter};
        const endpoint = contextPath().concat("api/member/quiz/history")
        return commonAjaxPostCalls(endpoint, request);
    }

}