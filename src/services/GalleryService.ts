  
import { contextPath } from '../constant/Url';
import { commonAjaxPublicPostCalls } from './Promises';
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
        return commonAjaxPublicPostCalls(endpoint, {filter:filter});
    }
    getVideos = (filter:Filter) => { 
        const endpoint = contextPath().concat("api/public/gallery/videos")
        return commonAjaxPublicPostCalls(endpoint, {filter:filter});
    }
   

}