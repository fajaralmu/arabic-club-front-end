

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseMainMenus from '../../layout/BaseMainMenus';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import PublicQuizService from './../../../services/PublicQuizService';
import Quiz from './../../../models/Quiz';
import Filter from './../../../models/Filter';
import WebResponse from '../../../models/WebResponse';
import Spinner from '../../loader/Spinner';
import Card from '../../container/Card';
import NavigationButtons from '../../navigation/NavigationButtons';

class IState {
    quizList: Quiz[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
}
class PublicQuizMain extends BaseMainMenus {
    publicQuizService: PublicQuizService = PublicQuizService.getInstance();
    state: IState = new IState();
    constructor(props: any) {
        super(props, "Take Quiz", false);
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
                {this.state.loading ? <Spinner /> : <QuizList startingNumber={(filter.limit ?? 0) * (filter.page ?? 0)} quizList={this.state.quizList} />}
            </div>
        )
    }
}

const QuizList = (props: { quizList: Quiz[], startingNumber: number }) => {

    return (
        <Card>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Title</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {props.quizList.map((quiz, i) => {

                        return (
                            <tr key={"quiz-public-list-" + i}>
                                <td>{i + props.startingNumber + 1}</td>
                                <td>{quiz.title}</td>
                                <td>{quiz.description}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Card>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(PublicQuizMain))