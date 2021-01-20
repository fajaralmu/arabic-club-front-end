import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { emptyPromise, commonAjaxPostCalls } from './Promises'; 
import Transaction from './../models/Transaction';
import WebRequest from './../models/WebRequest';
import WebResponse from './../models/WebResponse';
const axios = require('axios');
export default class BaseTransactionService {

    getProductList = (raw) => {
        if( raw.value == null || raw.value.toString().trim() == ""){
            return emptyPromise({entities:[]});
        }
        const fieldsFilter = {};
        fieldsFilter[raw.key] = raw.value;
        const request = {
            entity: "product", 
            filter: { 
                page: 0, 
                exacts: (raw.exacts == true), 
                limit: 15, 
                fieldsFilter: fieldsFilter 
            }
        }
        const endpoint = url.contextPath().concat("api/app/entity/get")
        return commonAjaxPostCalls(endpoint, request);
    }

    submitTransactionSelling = (transaction:Transaction) => this.submitTransaction({...transaction, type:'SELLING' })
    submitTransactionPurchasing = (transaction:Transaction) => this.submitTransaction({...transaction, type:'PURCHASING' })

    submitTransaction = (raw:Transaction) => {
        console.debug("submitTransaction ", raw.type);
        const type = raw.type;
        const request:WebRequest = {
            productFlows: raw.productFlows
        }
        return new Promise<WebResponse>(function (resolve, reject) {
            let endpoint:string = "";
            switch (type) {
                case "SELLING":
                    if(null == raw.customer){
                        reject("Invalid Customer");
                        break;
                    }
                    request.customer = raw.customer;
                    endpoint = url.contextPath().concat("api/app/transaction/selling")
                    break;
                case "PURCHASING": 
                default:
                    if(null == raw.supplier){
                        reject("Invalid Supplier");
                        break;
                    }
                    request.supplier = raw.supplier;
                    endpoint = url.contextPath().concat("api/app/transaction/purchasing")
                    break;
            } 
            axios.post(endpoint, request,{
                headers: commonAuthorizedHeader(),
            })
                .then(response => response.data).then(function (response:WebResponse) {
                    if (response.code == "00") 
                    { resolve(response) } 
                    else 
                    { reject(response) }
                }).
                catch((e:any) =>{ console.error(e); reject(e)});
        })
    }

    getStockInfo = (productCode:string) => {
        const request:WebRequest = {
            entity: "product",
            filter: {
                limit: 1,
                exacts: true,
                fieldsFilter: { "code": productCode, withStock: true }
            }
        }
        const endpoint = url.contextPath().concat("api/public/get")
        return commonAjaxPostCalls(endpoint, request);
    }
}