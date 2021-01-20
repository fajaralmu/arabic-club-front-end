import * as url from '../constant/Url'
import { commonAjaxPostCalls } from './Promises';
import WebRequest from './../models/WebRequest';
import Filter from './../models/Filter';
export default class CatalogService {
    private static instance?:CatalogService;
    totalProduct:number = 0;

    static getInstance(): CatalogService {
        if (this.instance == null) {
            this.instance = new CatalogService();
        }
        return this.instance;
    }
    setTotalProduct = (value:number) => {
        this.totalProduct = value;
    }
    getTotalProduct = () => {
        const endpoint = url.contextPath().concat("api/public/totalproduct");
        return commonAjaxPostCalls(endpoint, {});
    }
    /**
     * 
     * @param {JSON} raw 
     */
    getProductList = (raw:Filter) => {
         
        const fieldsFilter = {
            // withStock: raw.withStock == true,
            // withSupplier: raw.withSupplier == true,
            // withCategories: raw.withCategories == true,
            ... raw.fieldsFilter
        }
        
        const request:WebRequest = {
            entity: "product",
            filter: {
                exacts: raw.exacts == true,
                limit: raw.limit ? raw.limit : 10,
                page: raw.page ? raw.page : 0,
                fieldsFilter: fieldsFilter,
                orderBy: raw.orderBy,
                orderType: raw.orderType
            }
        }
        const endpoint = url.contextPath().concat("api/public/get");
        return commonAjaxPostCalls(endpoint, request);
      
    }

    /**
     * 
     * @param {String} code 
     */
    getProductDetail = (code:string) => this.getProductList({
        limit: 1,
        exacts: true,
        fieldsFilter: {
            'code' : code,
            'withStock': true,
            'withSupplier': true,
        }
    })

  /**
   * 
   * @param req 
   */
    getMoreSupplier = (req:any) => { 

        const request:WebRequest = {
            filter: {
                page: req.page,
                fieldsFilter: { productId: req.productId }
            }
        }
        const endpoint = url.contextPath().concat("api/public/moresupplier");
        return commonAjaxPostCalls(endpoint, request);
    }


}