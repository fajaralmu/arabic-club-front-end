
import User from '../models/User';
import WebRequest from '../models/WebRequest';
import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls, commonAjaxPublicPostCalls } from './Promises';
export default class CategoriesService
{
    private static instance?:CategoriesService;
    private categories:Map<string, any[]>= new Map();
    static getInstance(): CategoriesService {
        if (this.instance == null) {
            this.instance = new CategoriesService();
        }
        return this.instance;
    }
    getCategories = (code:string) => { 
        const endpoint = contextPath().concat("api/public/categories/"+code)
        return commonAjaxPublicPostCalls(endpoint, {});
    }
    getLoadedCategories = (code:string) : any[] =>{
        return this.categories.get(code) ?? [];
    }
    setLoadedCategories = (code:string, categories:any[]) =>{
        this.categories.set(code, categories);
    }

}