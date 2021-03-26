import BaseEntity from './BaseEntity';
import DocumentCategory from './DocumentCategory';

export default class Documents extends BaseEntity{
	title?:string;
	accessCode?:string;
	description?:string;
	category?:DocumentCategory;
	fileName?:string;

	getExtension = () : string => {
		if (!this.fileName) return "file";

		const splitted = this.fileName.split(".");
		if (splitted.length <= 1) return "file";
		return splitted[splitted.length-1];
	}
}
