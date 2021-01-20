import * as url from '../constant/Url'
import { rejectedPromise, commonAjaxPostCalls } from './Promises';
import WebRequest from './../models/WebRequest';
export default class MessageService {
    private static instance?:MessageService;

    static getInstance(): MessageService {
        if (this.instance == null) {
            this.instance = new MessageService();
        }
        return this.instance;
    }

    sendChatMessage = (raw:{username:string;message:string}) => {

        const request:WebRequest = {
            username: raw.username,
            value: raw.message
        }

        if(raw.message == null || raw.message.toString().trim() == ""){
            return rejectedPromise("Message cannot be empty!");
        }

        const endpoint = url.contextPath().concat("api/admin/sendmessage");
        return commonAjaxPostCalls(endpoint, request);
    }
}