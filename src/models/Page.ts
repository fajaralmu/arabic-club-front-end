import BaseEntity from './BaseEntity';

export default class Page extends BaseEntity{
	code?:string;
	name?:string;
	authorized?:number;
	nonMenuPage?:number;
	link?:string;
	description?:string;
	imageUrl?:string;
	menuHtmlIconClass?:string;
	sequence?:number;
	menus?:[];

}
