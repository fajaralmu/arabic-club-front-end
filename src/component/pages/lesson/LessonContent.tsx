import React from 'react'
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
class IState {
    lessons: Lesson[] | undefined = undefined;
    loading: boolean = false;
    filter: Filter = {
        limit: 5,
        page: 0
    }
    totalData: number = 0;
    category: LessonCategory | undefined = undefined
}
class LessonContent extends BaseComponent {
    lessonService: LessonService = LessonService.getInstance();
    state: IState = new IState();
    categoryCode: string = "";
    constructor(props) {
        super(props, false);
    }
    startLoading = () => {
        if (this.categoryCode != this.props.categoryCode) {
            this.categoryCode = this.props.categoryCode;
            this.setState({ loading: true })
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

        this.commonAjax(
            this.lessonService.getLessons,
            this.dataLoaded,
            this.showCommonErrorAlert,
            this.props.categoryCode,
            this.state.filter
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
        this.loadLessons();
    }
    updateLimit = (e) => {
        if (!e.target.value || e.target.value < 1) return;
        this.updateFilter('limit', e.target.value);
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
        const lessons: Lesson[] = this.state.lessons;
        const category: LessonCategory = this.state.category;
        return (
            <div className="container-fluid">
                <h2>Lessons: {category.name}</h2>
                <form className="row">

                    <div className="input-group col-md-6">
                        <input value="Per Page" className="form-control" disabled />
                        <input min={0} type="number" onChange={this.updateLimit} value={this.state.filter.limit} className="form-control" />
                        <AnchorWithIcon iconClassName="fas fa-sync-alt" onClick={this.loadLessons}>Reload</AnchorWithIcon>
                    </div>
                    <p className="col-md-6">Total Data; {this.state.totalData}</p>
                </form>
                <p/>
                <NavigationButtons activePage={this.state.filter.page ?? 0}
                    limit={this.state.filter.limit ?? 5}
                    totalData={this.state.totalData}
                    onClick={this.loadLessonsInPage} />
                {lessons.map((lesson, id) => {
                    const content: String = new String(lesson.content).length > 150 ? new String(lesson.content).substring(0, 150) + "..." :
                        new String(lesson.content);
                    return (
                        <Card attributes={{ style: { marginBottom: '5px' } }} key={uniqueId() + "-lesson"}>
                            <h3>{lesson.title}</h3>
                            <div dangerouslySetInnerHTML={{
                                __html: content.toString()
                            }} />
                            <p />
                            <AnchorWithIcon className="btn btn-info btn-sm" iconClassName="fas fa-angle-right">Read More</AnchorWithIcon>
                        </Card>
                    )
                })}
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(LessonContent))