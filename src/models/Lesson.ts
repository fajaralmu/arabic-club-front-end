import User from './User';
import BaseEntity from './BaseEntity';
import LessonCategory from './LessonCategory';
import { baseImageUrl } from './../constant/Url';

export default class Lesson extends BaseEntity{
	title?:string;
	content?:string;
	description?:string;
	bannerImages?:string;
	category?:LessonCategory;
	user?:User;

	static getImageUrs = (lesson:Lesson) : string[] => {
		const urls:string[] = [];
		if (lesson.bannerImages == undefined) return urls;
		const splitted = lesson.bannerImages.split("~");
		for (let i = 0; i < splitted.length; i++) {
			const element = splitted[i];
			urls.push(baseImageUrl()+"/"+element);
		}
		return urls;
	}

}
