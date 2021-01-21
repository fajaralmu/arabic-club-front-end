import BaseEntity from './BaseEntity';
import ImageCategory from './ImageCategory';

export default class Images extends BaseEntity{
	title?:string;
	description?:string;
	category?:ImageCategory;
	images?:string;

}
