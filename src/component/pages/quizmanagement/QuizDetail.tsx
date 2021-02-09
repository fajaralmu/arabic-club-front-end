

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import Quiz from './../../../models/Quiz';
import SimpleError from '../../alert/SimpleError';
import FormGroup from '../../form/FormGroup';
import QuizQuestion from './../../../models/QuizQuestion';
import Card from '../../container/Card';
import QuizChoice from './../../../models/QuizChoice';
import QuizService from './../../../services/QuizService';
import WebResponse from './../../../models/WebResponse';
import AnchorButton from './../../navigation/AnchorButton';
import { baseImageUrl } from './../../../constant/Url';
import Spinner from '../../loader/Spinner';

class IState {
    quiz: Quiz | undefined = undefined;
    loading: boolean = false;
}
class QuizDetail extends BaseComponent {
    quizService: QuizService;
    state: IState = new IState();
    constructor(props: any) {
        super(props, true);
        this.quizService = this.getServices().quizService;
    }
    startLoading = (withProgress: boolean) => {
        super.startLoading(withProgress);
        this.setState({ loading: true });
    }
    endLoading = () => {
        super.endLoading();
        this.setState({ loading: false });
    }
    componentDidMount() {
        this.validateLoginStatus();
        this.loadQuiz();
        document.title = "Quiz Detail";
    }
    loadQuiz = () => {
        this.commonAjaxWithProgress(
            this.quizService.getQuiz,
            this.dataLoaded,
            this.showCommonErrorAlert,
            parseInt(this.getId())
        )
    }
    dataLoaded = (response: WebResponse) => {
        this.setState({ quiz: response.quiz });
    }
    getId = () => {
        return this.props.match.params.id;
    }
    editRecord = (e) => {
        const app = this;
        this.showConfirmation("Edit Quiz?")
            .then(function (ok) {
                if (!ok) return;
                app.props.history.push({
                    pathname: "/quizmanagement/form",
                    state: { quiz: app.state.quiz }
                })
            });
    }
    deleteRecord = (e) => {
        const app = this;
        this.showConfirmationDanger("Delete Quiz?")
            .then(function (ok) {
                if (!ok) return;
                app.doDeleteQuiz();
            });
    }
    doDeleteQuiz = () => {
        if (!this.state.quiz) return;
        this.commonAjaxWithProgress(
            this.quizService.deleteQuiz,
            this.dataDeleted,
            this.showCommonErrorAlert,
            this.state.quiz.id
        )
    }
    dataDeleted = (response: WebResponse) => {
        this.showInfo("Record Deleted");
        this.setState({ quiz: undefined });
    }

    render() {
        
        if (!this.state.quiz) {
            return (
                <div id="QuizDetail" className="container-fluid">
                    <h2>Quiz Detail</h2>
                    {this.state.loading?<Spinner/>:<SimpleError children="No Data"/>}
                </div>
            )
        }
        const quiz: Quiz = Object.assign(new Quiz, this.state.quiz);
        const questions: QuizQuestion[] = quiz.questions ?? [];
        return (
            <div id="QuizDetail" className="container-fluid">
                <h2>Quiz Detail</h2>
                <div >
                    <div className="alert alert-info">
                        <FormGroup label="Title">{quiz.title}</FormGroup>
                        <FormGroup label="Description">{quiz.description}</FormGroup>
                        <FormGroup label="Duration (Second)">{quiz.duration}</FormGroup>
                        <FormGroup label="Active">{quiz.active?"true":"false"}</FormGroup>
                        <FormGroup>
                            <AnchorButton className="btn btn-warning" onClick={this.editRecord}>Edit</AnchorButton>
                            <AnchorButton className="btn btn-danger" onClick={this.deleteRecord}>Delete</AnchorButton>
                        </FormGroup>
                    </div>
                    {questions.map((question, i) => {
                        const choices: QuizChoice[] = question.choices ?? [];
                        return (
                            <Card key={"qdl-" + i} attributes={{ style: { marginBottom: '5px' } }}>
                                <h4>{i + 1}. {question.statement}</h4>
                                {question.image ? <img src={baseImageUrl() + question.image} height="100" /> : null}
                                {choices.map((choice, c) => {
                                    const rightAnswer = choice.answerCode == question.answerCode;
                                    return (
                                        <div key={"qdc-" + i + c}>
                                            <b className={rightAnswer ? "border rounded border-success text-success" : "text-dark"}>{choice.answerCode}</b>
                                            <span style={{ marginLeft: '5px' }}>{choice.statement}</span>
                                            <p />
                                            {choice.image ? <img src={baseImageUrl() + choice.image} height="100" /> : null}
                                        </div>
                                    )
                                })}
                            </Card>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizDetail))