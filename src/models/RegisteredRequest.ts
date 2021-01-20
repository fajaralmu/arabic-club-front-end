import BaseEntity from './BaseEntity';

export default class RegisteredRequest extends BaseEntity{
	requestId?:string;
	value?:string;
	created?:Date;
	referrer?:string;
	userAgent?:string;
	ipAddress?:string;
	messages?:[];
	active?:boolean;

}
