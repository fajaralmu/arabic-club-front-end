import BaseEntity from './BaseEntity';
import DocumentCategory from './DocumentCategory';

export default class Documents extends BaseEntity{
	title?:string;
	description?:string;
	category?:DocumentCategory;
	fileName?:string;

}
