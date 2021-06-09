

import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises'; 
import Quiz from './../models/Quiz';
import Filter from '../models/commons/Filter';
import AttachmentInfo from './../models/AttachmentInfo';
export default class QuizService {
    getHistoryDetail(id: any) {
        const endpoint = contextPath().concat("api/member/quiz/history/"+id)
        return commonAjaxPostCalls(endpoint, {});
    }
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
    uploadQuiz = (attachment:AttachmentInfo) => {
        const endpoint = contextPath().concat("api/app/quiz/uploadquiz")
        return commonAjaxPostCalls(endpoint, {attachmentInfo:attachment});
    }

}