
import UserService from './UserService';
import CategoriesService from './CategoriesService';
import LessonService from './LessonService';
import MasterDataService from './MasterDataService';
import PublicQuizService from './PublicQuizService';
import QuizService from './QuizService';
import GalleryService from './GalleryService';
export default interface Services {
    userService: UserService,
    categoriesService: CategoriesService,
    lessonService: LessonService,
    masterDataService: MasterDataService,
    publicQuizService: PublicQuizService,
    quizService: QuizService,
    galleryService: GalleryService,
}