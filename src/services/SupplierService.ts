import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { commonAjaxPostCalls } from './Promises';
import WebRequest from './../models/WebRequest';
export default class SupplierService {
    private static instance?:SupplierService;
    
    static getInstance() :SupplierService
    {
        if (this.instance == null) {
            this.instance = new SupplierService();
        }
        return this.instance;
    }

    getSupplierList = (raw) => {
        const fieldsFilter = {}
        fieldsFilter[raw.key] = raw.value;
        const request:WebRequest = {
            entity: "supplier",
            filter: {
                limit: raw.limit ? raw.limit : 10,
                page: raw.page ? raw.page : 0,
                exacts: raw.exacts == true,
                fieldsFilter: fieldsFilter,
                orderBy: raw.orderby,
                orderType: raw.ordertype
            }
        };
        const endpoint = url.contextPath().concat("api/public/get");
        return commonAjaxPostCalls(endpoint, request);
    }

    getProductSupplied = (supplierId:number) => {
        const request = { supplier: { id: supplierId } };
        const endpoint = url.contextPath().concat("api/public/productssupplied");

        return commonAjaxPostCalls(endpoint, request);
    }
}