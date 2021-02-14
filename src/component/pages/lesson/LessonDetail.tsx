

import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from '../../layout/BaseMainMenus';
import Lesson from './../../../models/Lesson';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import Card from './../../container/Card';
import Carousel from '../../container/Carousel';

class LessonDetail extends BaseMainMenus {

    constructor(props: any) {
        super(props, "Lessons", false);
    }

    componentDidMount() {
        document.title = this.props.lesson.title;
    }


    render() {
        const lesson: Lesson | undefined = this.props.lesson;
        if (!lesson) return <></>;

        return (
            <div className="container-fluid">
                <h2>{lesson.title}</h2>
                <p className="text-dark"><i className="fas fa-edit" />{lesson.user?.displayName}, {lesson.createdDate ? new Date(lesson.createdDate).toLocaleString() : ""}</p>
                <AnchorWithIcon iconClassName="fas fa-angle-left" onClick={this.props.back}>Back</AnchorWithIcon>
                
                {lesson.bannerImages?
                    <><p/><Carousel imageUrls={Lesson.getImageUrs(lesson)} /><p/></>:<p/>}
               
                <Card>
                    
                    <div dangerouslySetInnerHTML={{
                    __html: lesson.content ? lesson.content.toString() : ""
                }} />
                </Card>
                <p/>
                <p><i className="fas fa-tags"></i>&nbsp;{lesson.category?.name}</p>
                <AnchorWithIcon iconClassName="fas fa-angle-left" onClick={this.props.back}>Back</AnchorWithIcon>
                <p/>
            </div>
        )
    }
}
export default withRouter(connect(
    mapCommonUserStateToProps
)(LessonDetail))