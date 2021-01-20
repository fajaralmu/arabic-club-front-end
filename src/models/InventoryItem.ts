import BaseEntity from './BaseEntity';
import Product from './Product';
import ProductFlow from './ProductFlow';

export default class InventoryItem extends BaseEntity{
	incomingFlowId?:number;
	count?:number;
	product?:Product;
	originalCount?:number;
	newVersion?:boolean;
	productFlow?:ProductFlow;

}
