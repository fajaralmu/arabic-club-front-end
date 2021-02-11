
import { AuthorityType } from '../models/AuthorityType';
import Menu from '../models/settings/Menu';

export const HOME = "home"; 
export const ABOUT = "about";
export const ACCOUNT = "account";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const DASHBOARD = "dashboard"; 
export const MENU_SETTING = "settings";
export const MENU_MASTER_DATA = "management";
export const LESSONS = "lessons";
export const CLUB = "language_club";
export const EVENTS = "events";
export const GALLERY = "gallery"; 
export const CHATROOM = "chatroom";
export const QUIZ_MANAGEMENT = "quiz_management";
export const PUBLIC_QUIZ = "public_quiz";

export const getMenus = () => {
    let menuSet: Menu[] = [];
    for (let i = 0; i < _menus.length; i++) {
        const element: Menu = _menus[i];
        const menu:Menu = Object.assign(new Menu, element);
        const subMenus:Menu[] = [];
        if (element.subMenus) {
            for (let i = 0; i < element.subMenus.length; i++) {
                const subMenu = element.subMenus[i];
                subMenus.push(Object.assign(new Menu, subMenu));
            }
            menu.subMenus = subMenus;
        }
        menuSet.push(menu);
    }
    
    return menuSet;
}
export const extractMenuPath = (pathName: string) => {
    const pathRaw = pathName.split('/');
   
    let firstPath = pathRaw[0];
    if (firstPath.trim() == "") {
        firstPath = pathRaw[1];
    }
    return firstPath;
}
export const getMenuByMenuPath = (pathName: string): Menu | null => {
    const menus = getMenus();
    try {
        for (let i = 0; i < menus.length; i++) {
            const menu: Menu = menus[i];
            if (menu.url == "/" + pathName) {
                return menu;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

const _menus: Menu[] = [
    {
        code: HOME,
        name: "Home",
        url: "/home",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false,
        showSidebar: false,
        role : []
    },
    {
        code: LESSONS,
        name: "Lessons",
        url: "/lessons",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false,
        showSidebar: true,
        role : []
    },
    {
        code: EVENTS,
        name: "Events",
        url: "/events",
        menuClass: "fa fa-calendar-week",
        active: false,
        authenticated: false,
        showSidebar: true,
        role : [],
        subMenus: [
            {
                code: 'e_public_speaking',
                name: 'Public Speaking',
                url: 'publicspeaking',
                menuClass: 'fas fa-broadcast-tower',
                role : [],
            },
            {
                code: 'e_skills',
                name: 'Skill',
                url: 'skill',
                menuClass: 'fas fa-basketball-ball',
                role : [],
            }
        ]
    },
    
    {
        code: GALLERY,
        name: "Gallery",
        url: "/gallery",
        menuClass: "fa fa-photo-video",
        active: false,
        authenticated: false,
        showSidebar: true,
        role: [],
        subMenus: [
            {
                code: 'gallery_picture',
                name: 'Pictures',
                url: 'picture',
                menuClass: 'fas fa-images',
                role: [],

            },
            {
                code: 'gallery_video',
                name: 'Videos',
                url: 'video',
                menuClass: 'fas fa-video',
                role: [],
            }
        ]
    },
    {
        code: DASHBOARD,
        name: "Dashboard",
        url: "/dashboard",
        menuClass: "fas fa-tachometer-alt",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [AuthorityType.ROLE_ADMIN, AuthorityType.ROLE_USER],
        subMenus: [
            {
                code: 'dashboard_quiz_history',
                name: 'Quiz History',
                url: 'quizhistory',
                menuClass: 'fas fa-history',
                role: [AuthorityType.ROLE_ADMIN, AuthorityType.ROLE_USER],
            },
            // {
            //     code: 'dashboard_productsales',
            //     name: 'Product Sales',
            //     url: 'productsales',
            //     menuClass: 'fas fa-chart-line',
            //     role: [],
            // }
        ]
    }, 
    {
        code: PUBLIC_QUIZ,
        name: "Quiz",
        url: "/quiz",
        menuClass: "fas fa-book",
        active: false,
        authenticated: true,
        showSidebar: false,
        subMenus: [],
        role: [AuthorityType.ROLE_ADMIN, AuthorityType.ROLE_USER]
    },
    {
        code: QUIZ_MANAGEMENT,
        name: "Quiz Management",
        url: "/quizmanagement",
        menuClass: "fas fa-chalkboard",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [AuthorityType.ROLE_ADMIN],
        subMenus: [
            {
                code: 'quiz_management_form',
                name: 'Quiz Form',
                url: 'form',
                menuClass: 'fas fa-keyboard',
                role:[]
            }, 
        ]
    }, 
    {
        code: MENU_MASTER_DATA,
        name: "Master Data",
        url: "/management",
        menuClass: "fa fa-database",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [AuthorityType.ROLE_ADMIN],
    },
    {
        code: MENU_SETTING,
        name: "Setting",
        url: "/settings",
        menuClass: "fas fa-cogs",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [AuthorityType.ROLE_ADMIN ,AuthorityType.ROLE_USER],
        subMenus: [
            {
                code: 'user_profile',
                name: 'Profile',
                menuClass: 'fas fa-user-cog',
                url: 'user-profile',
                role: [AuthorityType.ROLE_ADMIN, AuthorityType.ROLE_USER],
            },
            {
                code: 'app_profile',
                name: 'Application Setting',
                menuClass: 'fas fa-cog',
                url: 'app-profile',
                role: [AuthorityType.ROLE_ADMIN ],
            },
            
        ]
    },
];
