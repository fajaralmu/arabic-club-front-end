import * as url from '../constant/Url'
import BaseTransactionService from './BaseTransactionService';
import { commonAjaxPostCalls } from './Promises';
import WebRequest from './../models/WebRequest';
export default class TransactionSellingService extends BaseTransactionService{
    private static instance?:TransactionSellingService;

    static getInstance(): TransactionSellingService {
        if (this.instance == null) {
            this.instance = new TransactionSellingService();
        }
        return this.instance;
    }

    getCustomerList = (raw:any) => {
        const fieldsFilter = {};
        fieldsFilter[raw.key] = raw.value;
        const request:WebRequest = {
            entity: "customer",
            filter: {
                page: (raw.page > 0 ? raw.page : 0),
                limit: (raw.limit > 0 ? raw.limit : 10),
                exacts: (raw.exacts == true),
                fieldsFilter: fieldsFilter
            }
        }

        const endpoint = url.contextPath().concat("api/app/entity/get")
        return commonAjaxPostCalls(endpoint, request);
    }

}