import React, { ChangeEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LessonService from './../../../services/LessonService';
import Lesson from './../../../models/Lesson';
import Filter from './../../../models/Filter';
import WebResponse from './../../../models/WebResponse';
import LessonCategory from '../../../models/LessonCategory';
import Spinner from '../../loader/Spinner';
import SimpleError from '../../alert/SimpleError';
import Card from './../../container/Card';
import { uniqueId } from './../../../utils/StringUtil';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import NavigationButtons from '../../navigation/NavigationButtons';
import LessonDetail from './LessonDetail';
import WebRequest from './../../../models/WebRequest';
class IState {
    lessons: Lesson[] | undefined = undefined;
    loading: boolean = false;
    filter: Filter = {
        limit: 5,
        page: 0
    }
    selectedLesson: Lesson | undefined;
    totalData: number = 0;
    category: LessonCategory | undefined = undefined;
    filterValue?: string
}
class LessonContent extends BaseComponent {
    lessonService: LessonService;
    state: IState = new IState();
    categoryCode: string = "";
    constructor(props) {
        super(props, false);
        this.lessonService = this.getServices().lessonService;
    }
    startLoading = () => {
        if (this.categoryCode != this.props.categoryCode) {
            this.categoryCode = this.props.categoryCode;
            this.setState({ loading: true, selectedLesson: undefined })
        } else {
            super.startLoading(false);
        }
    }
    endLoading = () => {
        if (this.categoryCode == this.props.categoryCode && this.state.loading) {
            this.setState({ loading: false });
        } else {
            super.endLoading();
        }

    }
    dataLoaded = (response: WebResponse) => {
        const lessons = response.entities;
        this.categoryCode = this.props.categoryCode;
        this.setState({ lessons: lessons, totalData: response.totalData, category: response.entity });
    }
    loadLessons = () => {
        const request: WebRequest = {
            filter: {
                ...this.state.filter,
                fieldsFilter: {
                    'value': this.state.filterValue
                }
            },
        }
        this.commonAjax(
            this.lessonService.getLessons,
            this.dataLoaded,
            this.showCommonErrorAlert,
            this.props.categoryCode,
            request
        );
    }
    componentDidMount() {
        this.loadLessons();
    }
    componentDidUpdate() {
        if (this.categoryCode != this.props.categoryCode) {
            this.loadLessonsInPage(0);
        }
    }
    loadLessonsInPage = (page) => {
        this.updateFilter('page', page);
        this.loadLessons();
    }
    updateFilter = (key: string, value: any) => {
        const filter = this.state.filter;
        filter[key] = value;
        this.setState({ filter: filter });
        // this.loadLessons();
    }
    updateLimit = (e) => {
        if (!e.target.value || e.target.value < 1) return;
        this.updateFilter('limit', e.target.value);
    }
    setSelectedLesson = (lesson: Lesson | undefined) => {
        this.setState({ selectedLesson: lesson });
    }
    setSelectedLessonUndefined = () => {
        document.title = "Lessons"
        this.setSelectedLesson(undefined);
    }
    setFilterValue = (e) => {
        this.setState({ filterValue: e.target.value });
    }
    clearFilter = (e) => {
        this.setState({ filterValue: undefined });
        this.updateFilter('limit', 5);
    }
    render() {
        if (this.state.loading) {
            return (<div className="container-fluid">
                <h2>Lessons</h2>
                <Spinner />
            </div>)
        }
        if (this.state.lessons == undefined || this.state.category == undefined) {
            return (<div className="container-fluid">
                <h2>Lessons</h2>
                <SimpleError>Data not found</SimpleError>
            </div>)
        }
        if (this.state.selectedLesson) {
            return <LessonDetail lesson={this.state.selectedLesson} back={this.setSelectedLessonUndefined} />
        }
        const lessons: Lesson[] = this.state.lessons;
        const category: LessonCategory = this.state.category;
        return (
            <div className="container-fluid">
                <h2>Lessons - {category.name}</h2>
                <form className="row" onSubmit={(e) => { e.preventDefault(); this.loadLessons() }}>

                    <div className="input-group col-md-6">
                        <input value="Per Page" className="form-control" disabled />
                        <input min={0} type="number" onChange={this.updateLimit} value={this.state.filter.limit} className="form-control" />
                    </div>
                    <div className="input-group col-md-6">
                        <input autoComplete="off" type="search" placeholder="Search..." onChange={this.setFilterValue} value={this.state.filterValue} className="form-control" />
                        <input type="submit" value="Reload" className="btn btn-info" />
                        <button type="reset" className="btn btn-warning" onClick={this.clearFilter} >Clear Filter</button>
                    </div>
                </form>
                <p />
                <NavigationButtons activePage={this.state.filter.page ?? 0}
                    limit={this.state.filter.limit ?? 5}
                    totalData={this.state.totalData}
                    onClick={this.loadLessonsInPage} />
                {lessons.length == 0? <SimpleError>No Data</SimpleError>:null}
                {lessons.map((lesson, id) => {

                    return (
                        <LessonItem setSelectedLesson={this.setSelectedLesson} key={uniqueId() + "-lesson"} lesson={lesson} />
                    )
                })}
            </div>
        )
    }
}
const LessonItem = (props: { lesson: Lesson, setSelectedLesson: Function }) => {
    const lesson: Lesson = props.lesson;
    const content: String = new String(lesson.content).length > 150 ? new String(lesson.content).substring(0, 150) + "..." :
        new String(lesson.content);
    return (<Card attributes={{ style: { marginBottom: '5px' } }}>
        <h3>{lesson.title}</h3>
        {/* <p className="text-dark"><i className="fas fa-edit" />&nbsp;{lesson.user?.displayName}</p> */}
        <p><i className="fas fa-clock"/>&nbsp;{lesson.createdDate ? new Date(lesson.createdDate).toLocaleString() : ""}</p>
        <div dangerouslySetInnerHTML={{
            __html: content.toString()
        }} />
        <p />
        <AnchorWithIcon onClick={(e) => props.setSelectedLesson(lesson)} className="btn btn-outline-dark btn-sm" iconClassName="fas fa-angle-right">Read More</AnchorWithIcon>
    </Card>)
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(LessonContent))