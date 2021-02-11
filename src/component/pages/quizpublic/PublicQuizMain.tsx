

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseMainMenus from '../../layout/BaseMainMenus';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import PublicQuizService from '../../../services/PublicQuizService';
import Quiz from '../../../models/Quiz';
import Filter from '../../../models/Filter';
import WebResponse from '../../../models/WebResponse';
import Spinner from '../../loader/Spinner';
import NavigationButtons from '../../navigation/NavigationButtons';
import QuizList from '../quizshared/QuizList';
import Card from './../../container/Card';

class IState {
    quizList: Quiz[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
}
class PublicQuizMain extends BaseMainMenus {
    publicQuizService: PublicQuizService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Take Quiz", true);
        this.publicQuizService = this.getServices().publicQuizService;
    }
    startLoading = (realtime:boolean) => { this.setState({ loading: true }); super.startLoading(realtime) }
    endLoading = () => { this.setState({ loading: false }); super.endLoading() }
    componentDidMount() {
        super.componentDidMount();
        this.loadRecords();
    }

    dataLoaded = (response: WebResponse) => {
        this.setState({ quizList: response.entities ?? [], totalData: response.totalData });
    }

    loadRecords = () => {
        if (this.state.loading) return;
        const filter = this.state.filter;
        filter.availabilityCheck = true;
        this.commonAjaxWithProgress(
            this.publicQuizService.getQuizList,
            this.dataLoaded,
            this.showCommonErrorAlert,
            filter
        )
    }
    loadRecordsWithFilter = (fieldsFilter: any) => {
        if (this.state.loading) return;
        const filter = this.state.filter;
        filter.page = 0;
        filter.fieldsFilter = fieldsFilter;
        this.setState({ filter: filter });
        this.loadRecords();
    }
    loadRecordsAtPage = (page: number) => {
        if (this.state.loading) return;
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter });
        this.loadRecords();
    }
    takeQuiz = (quiz: Quiz) => {
        this.showConfirmation("Take Quiz: " + quiz.title + "?")
            .then((ok) => {
                if (ok) {
                    this.props.history.push({ pathname: "/quiz/challenge/" + quiz.id })
                }
            })
    }
    render() {
        const filter: Filter = this.state.filter;
        const startNumber = (filter.limit ?? 0) * (filter.page ?? 0);
        return (
            <div id="PublicQuizMain" style={{ marginTop: '20px', }} className="container-fluid">
                <h2>Take Quiz</h2>
                <div className="alert alert-info">
                    Challenge your self
                </div>
                <NavigationButtons
                    activePage={filter.page ?? 0}
                    limit={filter.limit ?? 5} totalData={this.state.totalData}
                    onClick={this.loadRecordsAtPage}
                />
                <QuizList 
                    loading={this.state.loading}
                    onFilter = {this.loadRecordsWithFilter}
                    quizOnClick={this.takeQuiz} 
                    startingNumber={startNumber} quizList={this.state.quizList} /> 
            </div>
        )
    }
}


export default withRouter(connect(
    mapCommonUserStateToProps
)(PublicQuizMain))