import BaseEntity from './BaseEntity';
import Product from './Product';

export default class ProductImage extends BaseEntity{
	code?:string;
	name?:string;
	url?:string;
	product?:Product;

}
