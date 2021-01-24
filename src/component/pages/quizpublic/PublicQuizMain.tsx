

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
        super(props, "Take Quiz", false);
        this.publicQuizService = this.getServices().publicQuizService;
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
        return (
            <div id="PublicQuizMain" style={{ marginTop: '20px', }} className="container-fluid">
                <h2>Take Quiz</h2>
                <div className="alert alert-info">
                    Challenge your self
                </div>
                <NavigationButtons
                    activePage={filter.page ?? 0}
                    limit={filter.limit ?? 5} totalData={this.state.totalData}
                    onClick={this.loadQuizesAtPage}
                />
                {this.state.loading ? <Spinner /> : <QuizList quizOnClick={this.takeQuiz} startingNumber={(filter.limit ?? 0) * (filter.page ?? 0)} quizList={this.state.quizList} />}
            </div>
        )
    }
}


export default withRouter(connect(
    mapCommonUserStateToProps
)(PublicQuizMain))