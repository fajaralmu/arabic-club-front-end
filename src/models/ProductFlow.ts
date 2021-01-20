import BaseEntity from './BaseEntity';
import Transaction from './Transaction';
import Product from './Product';
import ProductFlowStock from './ProductFlowStock';

export default class ProductFlow extends BaseEntity{

	transaction?:Transaction;
	expiryDate?:Date;
	price?:number;
	count?:number;
	flowReferenceId?:number;
	product?:Product;
	transactionId?:number;
	productFlowStock?:ProductFlowStock;
	totalPrice?:number; 
	static create(product:Product) :Product{
		const obj = new ProductFlow();
		obj.product = product;
		return obj;

	}
}
