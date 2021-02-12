import VideoCategory from './VideoCategory';
import User from './User';
import Images from './Images';
import ImageCategory from './ImageCategory';
import BaseEntity from './BaseEntity'; 
import Lesson from './Lesson';
import DocumentCategory from './DocumentCategory';
import Videos from './Videos';
import Filter from './Filter';
import Documents from './Documents';
import LessonCategory from './LessonCategory';
import ApplicationProfile from './ApplicationProfile';
import Quiz from './Quiz';
import QuizHistoryModel from './QuizHistory';

export default class WebRequest{
	entity?:string;
	user?:User;
	profile?:ApplicationProfile;
	lesson?:Lesson;
	lessoncategory?:LessonCategory;
	videos?:Videos;
	videocategory?:VideoCategory;
	images?:Images;
	imagecategory?:ImageCategory;
	documents?:Documents;
	documentcategory?:DocumentCategory;
	filter?:Filter;
	entityObject?:BaseEntity; 
	orderedEntities?:any[];
	regularTransaction?:boolean;
	imageData?:string;
	quiz?:Quiz
	quizHistory?:QuizHistoryModel;
	requestId?:string
	token?:string
}
