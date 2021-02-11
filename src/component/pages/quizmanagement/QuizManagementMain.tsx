

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseMainMenus from '../../layout/BaseMainMenus';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import PublicQuizService from './../../../services/PublicQuizService';
import Quiz from './../../../models/Quiz';
import Filter from './../../../models/Filter';
import WebResponse from './../../../models/WebResponse';
import NavigationButtons from './../../navigation/NavigationButtons';
import QuizList from './../quizshared/QuizList';
class IState {
    quizList: Quiz[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
}

class QuizManagementMain extends BaseMainMenus {
    quizService: PublicQuizService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Quiz Management", true);
        this.quizService = this.getServices().publicQuizService;
    }
    startLoading = (realtime: boolean) => { this.setState({ loading: true }); }
    endLoading = () => { this.setState({ loading: false }); }
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
        filter.availabilityCheck = false;
        this.commonAjax(
            this.quizService.getQuizList,
            this.dataLoaded,
            this.showCommonErrorAlert,
            filter
        )
    }
    loadRecordsAtPage = (page: number) => {
        if (this.state.loading) return;
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter });
        this.loadRecords();
    }
    loadRecordsWithFilter = (fieldsFilter: any) => {
        const filter = this.state.filter;
        filter.page = 0;
        filter.fieldsFilter = fieldsFilter;
        this.setState({ filter: filter });
        this.loadRecords();
    }
    editQuiz = (quiz: Quiz) => {
        this.showConfirmation("See Detail Quiz: " + quiz.title + "?")
            .then((ok) => {
                if (ok) {
                    this.props.history.push({ pathname: "/quizmanagement/detail/" + quiz.id })
                }
            })
    }
    render() {
        const filter = this.state.filter;
        return (
            <div id="QuizManagement" className="container-fluid">
                <h2>Quiz Management</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
                <NavigationButtons
                    activePage={filter.page ?? 0}
                    limit={filter.limit ?? 5} totalData={this.state.totalData}
                    onClick={this.loadRecordsAtPage}
                />
                <QuizList onFilter={this.loadRecordsWithFilter}
                    loading={this.state.loading}
                    quizOnClick={this.editQuiz}
                    startingNumber={(filter.limit ?? 0) * (filter.page ?? 0)}
                    quizList={this.state.quizList} />
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizManagementMain))