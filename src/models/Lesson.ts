import User from './User';
import BaseEntity from './BaseEntity';
import LessonCategory from './LessonCategory';

export default class Lesson extends BaseEntity{
	title?:string;
	content?:string;
	description?:string;
	bannerImages?:string;
	category?:LessonCategory;
	user?:User;

}
