

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
import Spinner from './../../loader/Spinner';
import QuizList from './../quizshared/QuizList';
class IState {
    quizList: Quiz[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
}

class QuizManagementMain extends BaseMainMenus {
    publicQuizService: PublicQuizService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Quiz Management", true);
        this.publicQuizService = this.getSerivices().publicQuizService;
    }
    startLoading = () => { this.setState({ loading: true }); }
    endLoading = () => { this.setState({ loading: false }); }
    componentDidMount() {
        super.componentDidMount();
        this.loadQuizes();
    }
    dataLoaded = (response: WebResponse) => {
        this.setState({ quizList: response.entities ?? [], totalData: response.totalData });
    }

    loadQuizes = () => {
        this.commonAjax(
            this.publicQuizService.getQuizList,
            this.dataLoaded,
            this.showCommonErrorAlert,
            this.state.filter
        )
    }
    loadQuizesAtPage = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter });
        this.loadQuizes();
    }
    editQuiz = (quiz:Quiz) => {
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
                    onClick={this.loadQuizesAtPage}
                />
                {this.state.loading ? <Spinner /> : <QuizList quizOnClick={this.editQuiz} startingNumber={(filter.limit ?? 0) * (filter.page ?? 0)} quizList={this.state.quizList} />}
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizManagementMain))