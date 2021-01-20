import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import BaseTransactionService from './BaseTransactionService';
import Supplier from './../models/Supplier';
import ProductFlow from './../models/ProductFlow';
import WebRequest from './../models/WebRequest';
import { commonAjaxPostCalls } from './Promises';
import { contextPath } from './../constant/Url';
export default class TransactionPurchasingService extends BaseTransactionService {
    private static instance?:TransactionPurchasingService;

    static getInstance(): TransactionPurchasingService {
        if (this.instance == null) {
            this.instance = new TransactionPurchasingService();
        }
        return this.instance;
    } 

    // submit = (productFlows:ProductFlow[], supplier: Supplier) => {
    //     const request:WebRequest = {
    //         supplier:supplier,
    //         productFlows:productFlows
    //     };
    //     const endpoint = contextPath()+"api/app/transaction/purchasing";
    //     return commonAjaxPostCalls(endpoint, request);
    // }
}