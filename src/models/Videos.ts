import VideoCategory from './VideoCategory';
import BaseEntity from './BaseEntity';

export default class Videos extends BaseEntity{
	title?:string;
	url?:string;
	description?:string;
	category?:VideoCategory;

}
