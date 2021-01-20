import User from './User';

export default class UserSessionModel{
	user?:User;
	requestKey?:string;
	requestId?:string;
	jwt?:string;

}
