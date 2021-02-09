

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../pages/login/Login';
import DashboardMain from '../pages/dashboard/main/DashboardMain';
import MasterDataMain from '../pages/masterdata/MasterDataMain'; 
import HomeMain from '../pages/home/HomeMain'; 
import BaseMainMenus from './BaseMainMenus';
import Menu from '../../models/settings/Menu';    
import SettingsMain from '../pages/settings/SettingsMain';
import UserProfile from '../pages/settings/UserProfile';
import EditApplicationProfile from '../pages/settings/EditApplicationProfile';
import AboutUs from './../pages/home/AboutUs';
import LessonMain from '../pages/lesson/LessonMain';
import LessonContent from '../pages/lesson/LessonContent';
import QuizManagementMain from '../pages/quizmanagement/QuizManagementMain';
import QuizManagementForm from '../pages/quizmanagement/QuizManagementForm';
import QuizDetail from '../pages/quizmanagement/QuizDetail';
import PublicQuizMain from '../pages/quizpublic/PublicQuizMain';
import PublicQuizChallenge from '../pages/quizpublic/PublicQuizChallenge';
import GalleryMain from '../pages/gallery/GalleryMain';
import GalleryPicture from '../pages/gallery/picture/GalleryPicture';

class ApplicationContent extends BaseComponent {

    ref: React.RefObject<BaseMainMenus> = React.createRef();
    constructor(props: any) {
        super(props, false);
    }
    setSidebarMenus=(menus:Menu[])=>{
        this.props.setSidebarMenus(menus);
    }
    render() {
        return (
            <div style={{ paddingTop: '65px' }}>
                <Switch>
                    <Route exact path="/login" render={
                        (props: any) =>
                            <Login  />
                    } />
                    {/* -------- home -------- */}
                    <Route exact path="/home" render={
                        (props: any) =>
                            <HomeMain  />
                    } />
                    <Route exact path="/" render={
                        (props: any) =>
                            <HomeMain  />
                    } />
                   <Route exact path="/about" render={
                        (props: any) =>
                            <AboutUs  />
                    } />
                      {/* -------- masterdata -------- */}
                      <Route exact path="/lessons" render={
                        (props: any) =>
                            <LessonMain setSidebarMenus={this.setSidebarMenus}  />
                    } />
                     <Route exact path="/lessons/:categoryCode" render={
                        (props: any) =>
                            <LessonMain setSidebarMenus={this.setSidebarMenus}  />
                    } />
                    {/* ---------- gallery --------- */}
                     <Route exact path="/gallery" render={
                        (props: any) => <GalleryMain   />
                    } /> 
                    <Route exact path="/gallery/picture" render={
                        (props: any) => <GalleryPicture   />
                    } />
                    {/* -------- quiz challenge-------- */}
                    <Route exact path="/quiz" render={
                        (props: any) =>
                            <PublicQuizMain   />
                    } /> 
                    <Route exact path="/quiz/challenge/:id" render={
                        (props: any) =>
                            <PublicQuizChallenge   />
                    } /> 
                    {/* -------- dashboard -------- */}
                    <Route exact path="/dashboard" render={
                        (props: any) =>
                            <DashboardMain   />
                    } /> 
                     {/* -------- quiz management -------- */}
                     <Route exact path="/quizmanagement" render={
                        (props: any) =>
                            <QuizManagementMain   />
                    } /> 
                     <Route exact path="/quizmanagement/form" render={
                        (props: any) =>
                            <QuizManagementForm  />
                    } /> 
                     <Route exact path="/quizmanagement/detail/:id" render={
                        (props: any) =>
                            <QuizDetail  />
                    } /> 
                    {/* -------- masterdata -------- */}
                    <Route exact path="/management" render={
                        (props: any) =>
                            <MasterDataMain setSidebarMenus={this.setSidebarMenus}  />
                    } />
                    <Route exact path="/management/:code" render={
                        (props: any) =>
                            <MasterDataMain setSidebarMenus={this.setSidebarMenus}  />
                    } />
                     
                    {/* -------- settings --------- */}
                    <Route exact path="/settings" render={
                        (props: any) =>
                            <SettingsMain  />
                    } />
                    <Route exact path="/settings/user-profile" render={
                        (props: any) =>
                            <UserProfile  />
                    } />
                    <Route exact path="/settings/app-profile" render={
                        (props: any) =>
                            <EditApplicationProfile  />
                    } />
                    {/* ///////// PUBLIC ///////// */}
                 
                </Switch>

            </div>
        )
    }
    componentDidMount() {
        // document.title = "Login";
    }

}



const mapDispatchToProps = (dispatch: Function) => ({})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(ApplicationContent))