
import UserService from '../services/UserService';
import CategoriesService from '../services/CategoriesService';
import LessonService from '../services/LessonService';
import MasterDataService from '../services/MasterDataService';
import PublicQuizService from '../services/PublicQuizService';
import QuizService from '../services/QuizService';
import Services from './../services/Services';

export const initState :{services:Services} = {
    services  :  {
        userService: UserService.getInstance(),
        categoriesService: CategoriesService.getInstance(),
        lessonService: LessonService.getInstance(),
        masterDataService: MasterDataService.getInstance(),
        publicQuizService: PublicQuizService.getInstance(),
        quizSerivce: QuizService.getInstance()
    }

};

export const reducer = (state = initState, action) => {

    return state;
}

export default reducer;