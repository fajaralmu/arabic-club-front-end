
import BasePage from './../BasePage';
export default class BaseMainMenus extends BasePage {

    constructor(props, title:string, authenticated:boolean = false) {
        super(props, title, authenticated);
    }

    componentDidMount(){
        if (this.authenticated) {
            this.validateLoginStatus(this.scrollTop);
        } else {
            this.scrollTop();
        }
        
    }

}