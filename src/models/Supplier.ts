import BaseEntity from './BaseEntity';

export default class Supplier extends BaseEntity{
	name?:string;
	address?:string;
	contact?:string;
	website?:string;
	iconUrl?:string;

}
