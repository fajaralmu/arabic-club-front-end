import VideoCategory from './VideoCategory';
import BaseEntity from './BaseEntity';
import Snippet from './Snippet';

export default class Videos extends BaseEntity{
	title?:string;
	url?:string;
	description?:string;
	category?:VideoCategory;
	videoSnippet?:Snippet;

}
