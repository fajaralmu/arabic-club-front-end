

import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises'; 
import WebRequest from './../models/WebRequest';
import Filter from './../models/Filter';
import Quiz from './../models/Quiz';
import { getLoginKey } from '../middlewares/Common';
import { sendToWebsocket } from '../utils/websockets';
import QuizQuestion from './../models/QuizQuestion';
import QuizHistoryModel from './../models/QuizHistory';
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
        const submited = Object.assign(new Quiz, quiz);
        for (let i = 0; i < submited.questions.length; i++) { 
            submited.questions[i].choices = undefined;
        }
        const endpoint = contextPath().concat("api/member/quiz/submit")
        return commonAjaxPostCalls(endpoint, {quiz:submited});
    }
    getQuizList = (filter:Filter) => {
        filter.orderBy = "title";
        filter.orderType = "asc";
        const request:WebRequest = {filter:filter};
        const endpoint = contextPath().concat("api/member/quiz/list")
        return commonAjaxPostCalls(endpoint, request);
    }
    getHistories = (filter:Filter) => {
        const request:WebRequest = {filter:filter};
        const endpoint = contextPath().concat("api/member/quiz/history")
        return commonAjaxPostCalls(endpoint, request);
    }

    /**
     * ================== update via websocket ==================
     */
    sendUpdateStart = (_quiz:Quiz, requestId:string) => {
        const quiz = Object.assign(new Quiz, _quiz);
        quiz.questions = [];
        sendToWebsocket("/app/quiz/start", {
            quizHistory:{
                quiz: quiz,
                token: getLoginKey(),
                requestId:  requestId
            }
        });
    }

    sendUpdateAnswer = (_quiz:Quiz,  requestId: string) => {
        const quiz = Object.assign(new Quiz, _quiz);
        try {
            Quiz.updateMappedAnswer(quiz);
            // console.debug(quiz.mappedAnswer);
            quiz.questions = [];
            const quizHistory:QuizHistoryModel = {
                updated: new Date(),
                requestId:  requestId,
                quiz: quiz,
                token: getLoginKey(),
            }
            sendToWebsocket("/app/quiz/answer", {
                quizHistory:quizHistory
            });
        } catch (e) {
            console.error(e);
        }
    }

}