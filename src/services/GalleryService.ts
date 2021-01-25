  
import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises';
import Filter from './../models/Filter';
export default class GalleryService
{
    private static instance?:GalleryService; 
    static getInstance(): GalleryService {
        if (this.instance == null) {
            this.instance = new GalleryService();
        }
        return this.instance;
    }
    getPictures = (filter:Filter) => { 
        const endpoint = contextPath().concat("api/public/gallery/pictures")
        return commonAjaxPostCalls(endpoint, {filter:filter});
    }
   

}