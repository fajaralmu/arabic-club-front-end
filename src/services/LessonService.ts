
import WebRequest from '../models/WebRequest';
import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises';
import Filter from './../models/Filter';
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
        return commonAjaxPostCalls(endpoint, request);
    }

}