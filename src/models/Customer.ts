import BaseEntity from './BaseEntity';

export default class Customer extends BaseEntity{
	username?:string;
	name?:string;
	address?:string;
	phone?:string;
	type?:string;
	email?:string;

}
