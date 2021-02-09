import { AuthorityType } from './AuthorityType';
import BaseEntity from './BaseEntity';

export default class User extends BaseEntity{
	username?:string;
	displayName?:string;
	editPassword?:string;
	profileImage?:string;
	role?:AuthorityType;
	requestId?:string; 

}
