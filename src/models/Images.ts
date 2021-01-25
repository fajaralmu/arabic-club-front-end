import BaseEntity from './BaseEntity';
import ImageCategory from './ImageCategory';

export default class Images extends BaseEntity{
	title?:string;
	description?:string;
	category?:ImageCategory;
	images?:string;

	public static getFirstImage = (images:Images) : string => {
		try {
			return new String(images.images).split("~")[0];
		} catch (error) {
			return "default.bmp";
		}
	}

}
