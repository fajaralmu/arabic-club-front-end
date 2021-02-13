
import WebRequest from '../models/WebRequest';
import { contextPath } from '../constant/Url';
import { commonAjaxPublicPostCalls } from './Promises'; 
export default class LessonService {
    private static instance?: LessonService;

    static getInstance(): LessonService {
        if (this.instance == null) {
            this.instance = new LessonService();
        }
        return this.instance;
    }
    getLessons = (categoryCode: string, request: WebRequest) => {

        const endpoint = contextPath().concat("api/public/lessons/" + categoryCode)
        return commonAjaxPublicPostCalls(endpoint, request);
    }

}