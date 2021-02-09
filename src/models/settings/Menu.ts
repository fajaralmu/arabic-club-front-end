import BaseEntity from '../BaseEntity'; 
import { uniqueId } from '../../utils/StringUtil';
import { AuthorityType } from '../AuthorityType';
import User from './../User';

export default class Menu extends BaseEntity{
	static defaultMenuIconClassName:string = "fas fa-folder";

	code:string = uniqueId();
	name?:string;
	description?:string;
	url?:string;
	pathVariables?:string; 
	iconUrl?:string;
	color?:string;
	fontColor?:string;
	role:AuthorityType[] = [];

	//
	active?:boolean = false;
	menuClass?:string = "fas fa-folder";
	authenticated?:boolean = false;
	showSidebar?:boolean  = false;
	subMenus?:Menu[] = undefined;

	static getIconClassName = (menu:Menu) => {
		if (undefined == menu.menuClass) {
			return Menu.defaultMenuIconClassName;
		}
		return menu.menuClass;
	}

	userAuthorized? = (user?:User) : boolean => {
		if (this.role.length == 0) return true;
		if (!user) return false;
		for (let i = 0; i < this.role.length; i++) {
			const element = this.role[i];
			if (user.role == element) {
				return true;
			}
		}
		return false;
	}
}
