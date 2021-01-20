import User from './User';
import BaseEntity from './BaseEntity';
import Filter from './Filter';
import Transaction from './Transaction';
import ProductFlowStock from './ProductFlowStock'; 
import ApplicationProfile from './ApplicationProfile';
import EntityProperty from './EntityProperty';

export default class WebResponse{
	date?:Date;
	user?:User;
	code?:string;
	message?:string;
	entities?:any[];
	generalList?:any[];
	entity?:BaseEntity;
	filter?:Filter;
	totalData?:number;
	transaction?:Transaction;
	productFlowStock?:ProductFlowStock;
	storage?:{};
	maxValue?:number;
	quantity?:number; 
	applicationProfile?:ApplicationProfile;
	percentage?:number;
	transactionYears?:number[];
	requestId?:string;
	token?:string;
	monthlyDetailIncome?:{};
	monthlyDetailCost?:{};
	dailyCashflow?:{};
	loggedIn?:boolean;
	success?:boolean;
	entityClass?:any;
	purchasings?:any[];
	sellings?:any[];
	entityProperty?:EntityProperty;

}
