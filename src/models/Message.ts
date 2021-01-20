import BaseEntity from './BaseEntity';

export default class Message extends BaseEntity{
	admin?:number;
	sender?:string;
	userAgent?:string;
	ipAddress?:string;
	text?:string;
	date?:Date;
	alias?:string;
	requestId?:string;

}
