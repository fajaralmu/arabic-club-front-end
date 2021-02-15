

import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from '../../layout/BaseMainMenus'; 
import WebResponse from '../../../models/WebResponse';
import Menu from '../../../models/settings/Menu'; 
import CategoriesService from './../../../services/CategoriesService';
import LessonCategory from './../../../models/LessonCategory';
import { uniqueId } from './../../../utils/StringUtil';
import Spinner from './../../loader/Spinner';
import SimpleError from '../../alert/SimpleError';
import LessonContent from './LessonContent';

interface IState {
    code?: string,
    loading: boolean
}
class LessonMain extends BaseMainMenus {
    categoriesService: CategoriesService;
     
    state: IState = {
        code: undefined, loading: false
    };
    constructor(props: any) {
        super(props, "Lessons", false);
        this.categoriesService = this.getServices().categoriesService;
    }
    startLoading = () => { this.setState({loading:true}) }
    endLoading = () => { this.setState({loading:false}) }

    lessonCategoriesLoaded = (response: WebResponse) => {
        this.categoriesService.setLoadedCategories('lesson', response.entities ? response.entities : []);
        this.setSidebarMenus();
        this.refresh();
    }
    setSidebarMenus = () => {
        const sidebarMenus: Menu[] = [];
        const lessonCategories: LessonCategory[] = this.categoriesService.getLoadedCategories('lesson');
        for (let i = 0; i < lessonCategories.length; i++) {
            const element = lessonCategories[i];
            sidebarMenus.push({
                name: element.name,
                url: element.code,
                code: element.code??uniqueId(),
                menuClass: element.iconClassName,
                role:[]
            });
        }
        if (this.props.setSidebarMenus) {
            this.props.setSidebarMenus(sidebarMenus);
        } 
    }
    loadManagamenetPages = () => {
        if (this.categoriesService.getLoadedCategories('lesson').length > 0) {
            this.setSidebarMenus();
            this.refresh();
            return;
        }
        this.commonAjax(
            this.categoriesService.getCategories,
            this.lessonCategoriesLoaded,
            this.showCommonErrorAlert,
            'lesson'
        );
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadManagamenetPages();
    }
    componentDidUpdate() {
        this.validateLoginStatus();
        this.setSidebarMenus();
         
    }
    getCode = (): string => {
        return this.props.match.params.categoryCode;
    }
    render() {
        if (this.getCode()) { 
            return <LessonContent  categoryCode={this.getCode()} />
        }
        const categories: LessonCategory[] = this.categoriesService.getLoadedCategories('lesson');
        if (this.state.loading) {
            return <div className="container-fluid"><Spinner/></div>
        }
        if (categories.length == 0) {
            return <div className="container-fluid">
                <SimpleError>No Categories Yet</SimpleError>
            </div>
        }
        
        return (
            <div className="container-fluid">
                <h2>Lessons</h2>
                <div className="row">
                    {categories.map(category => {
                        return (
                            <div key={"lesson-cat-"+category.id} className="col-md-2 text-center" style={{ marginBottom: '10px' }}>
                                <h2 ><Link className="btn btn-warning btn-lg" to={"/lessons/" + category.code} ><i className={category.iconClassName&&category.iconClassName!=""?category.iconClassName:"fas fa-folder"} /></Link></h2>
                                <p>{category.name}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        ) 
    }
}
export default withRouter(connect(
    mapCommonUserStateToProps
)(LessonMain))