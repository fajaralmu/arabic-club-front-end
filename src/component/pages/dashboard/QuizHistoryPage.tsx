

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from '../../layout/BaseMainMenus';
import User from './../../../models/User';
import PublicQuizService from './../../../services/PublicQuizService';
import QuizHistoryModel from './../../../models/QuizHistory';
import Filter from './../../../models/Filter';
import BaseComponent from './../../BaseComponent';
import WebResponse from './../../../models/WebResponse';
import NavigationButtons from './../../navigation/NavigationButtons';
import Card from './../../container/Card';
import Spinner from './../../loader/Spinner';
import SimpleWarning from './../../alert/SimpleWarning';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import ScrollDiv from '../../container/ScrollDiv';
class IState {
    histories: QuizHistoryModel[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
}
class QuizHistoryPage extends BaseComponent {
    publicQuizService: PublicQuizService;
    state: IState = new IState();
    constructor(props: any) {
        super(props,  true);
        this.publicQuizService = this.getServices().publicQuizService;
        document.title = "Quiz History";
    }
    startLoading = () => { this.setState({ loading: true }); }
    endLoading = () => { this.setState({ loading: false }); }
    componentDidMount() {
        super.componentDidMount();
        this.loadRecords();
    }
    dataLoaded = (response: WebResponse) => {
        this.setState({ histories: response.entities ?? [], totalData: response.totalData });
    }

    loadRecords = () => {
        if (this.state.loading) return;
        this.commonAjax(
            this.publicQuizService.getHistories,
            this.dataLoaded,
            this.showCommonErrorAlert,
            this.state.filter
        )
    }
    loadRecordsAtPage = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter });
        this.loadRecords();
    }
    render() {
        const user: User | undefined = this.getLoggedUser();
        if (!user) return null;
        const filter: Filter = this.state.filter;
        const startNumber = (filter.limit ?? 0) * (filter.page ?? 0);
        return (
            <div id="QuizHistoryPage" className="container-fluid">
                <h2>Quiz History</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{user.displayName}  </strong>
                    <p />
                    <p className="badge badge-dark">{user.role?.toLowerCase().split("_")[1]}</p>
                </div>
                <NavigationButtons
                    activePage={filter.page ?? 0}
                    limit={filter.limit ?? 5} totalData={this.state.totalData}
                    onClick={this.loadRecordsAtPage}
                />
                {this.state.loading ? <Card><Spinner /></Card>:<Histories loadRecords={this.loadRecords} startingNumber={startNumber} histories={this.state.histories}  />}
                <p/>
            </div>
        )
    }
}

const Histories = (props:{histories:QuizHistoryModel[], loadRecords():any, startingNumber:number}) => {
    if (props.histories.length == 0){
        return <Card><SimpleWarning>No Data</SimpleWarning>
        
        <AnchorWithIcon iconClassName="fas fa-sync-alt" className="btn btn-dark" onClick={props.loadRecords}>
                Reload
            </AnchorWithIcon>
            </Card>
    }
    return  (
        <Card  >
            <ScrollDiv>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Quiz</th>
                        <th>Quiz Duration</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>User Duration</th>
                        <th>Score</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {props.histories.map((h:QuizHistoryModel, i: number) => {
                        h = Object.assign(new QuizHistoryModel(), h);
                        return (
                            <tr key={"quiz-public-list-" + i}>
                                <td>{i + props.startingNumber + 1}</td>
                                <td>{h.quiz?.title}</td>
                                <td>{h.quizDuration}</td>
                                <td>{h.started?new Date(h.started).toLocaleString():"-"}</td>
                                <td>{h.ended?new Date(h.ended).toLocaleString():"-"}  </td>
                                <td>{h.userDuration} </td>
                                <td>{h.score?.toFixed(2)} </td>
                                <td>
                                    {h.quiz?.repeatable?
                                    <AnchorWithIcon attributes={{target:"_blank"}} to={"/quiz/challenge/"+h.quiz?.id} iconClassName="fas fa-redo" />:
                                    "Not Repeatable"
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </ScrollDiv>
            <p/>
            <AnchorWithIcon iconClassName="fas fa-sync-alt" className="btn btn-dark" onClick={props.loadRecords}>
                Reload
            </AnchorWithIcon>
        </Card >
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizHistoryPage))